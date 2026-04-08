/**
 * 作品选集 / 客户评价 — 仅使用原生横向滚动（overflow-x: auto + scrollLeft）
 * 无 pointerdown / preventDefault / setPointerCapture，避免点击与滑动抢手势。
 * 自动播放：rAF 写 scrollLeft；用户滑动后静默 200ms 再延迟 3s 恢复。
 */
(function () {
  var SCROLLPORT_SEL = '.marquee-scrollport';
  var RESUME_AFTER_IDLE_MS = 3000;
  var SCROLL_END_DEBOUNCE_MS = 200;

  var reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var instances = [];
  var rafId = 0;
  var lastGlobalT = 0;

  function loopSeconds(track) {
    var raw = getComputedStyle(track).getPropertyValue('--marquee-loop-seconds').trim();
    var n = parseFloat(raw) || 0;
    return n > 0 ? n : 52;
  }

  function isReverseTrack(track) {
    var row = track.closest('.testimonial-row');
    if (!row || !row.parentElement) return false;
    var list = row.parentElement.children;
    for (var i = 0; i < list.length; i++) {
      if (list[i] === row) return i % 2 === 1;
    }
    return false;
  }

  function loopWidth(track) {
    var first = track.firstElementChild;
    if (!first) return 0;
    var second = track.children[1];
    var w = 0;
    if (second) w = second.offsetLeft - first.offsetLeft;
    if (w < 1) w = first.offsetWidth;
    if (w < 1) w = first.getBoundingClientRect().width;
    return w;
  }

  function NativeMarquee(scrollport, track) {
    this.scrollport = scrollport;
    this.track = track;
    this.loopW = 0;
    this.rev = isReverseTrack(track) ? -1 : 1;
    this.programmatic = false;
    this.autoRun = true;
    this.resumeTimer = null;
    this.scrollEndTimer = null;
    this.reverseSeeded = false;
  }

  NativeMarquee.prototype.clearResume = function () {
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
  };

  NativeMarquee.prototype.armResume = function () {
    var self = this;
    this.clearResume();
    this.resumeTimer = setTimeout(function () {
      self.resumeTimer = null;
      self.autoRun = true;
    }, RESUME_AFTER_IDLE_MS);
  };

  NativeMarquee.prototype.endProgrammatic = function () {
    var self = this;
    requestAnimationFrame(function () {
      self.programmatic = false;
    });
  };

  NativeMarquee.prototype.measure = function () {
    var w = loopWidth(this.track);
    if (w < 1) return;
    this.loopW = w;
    this.rev = isReverseTrack(this.track) ? -1 : 1;
    if (this.rev < 0 && !this.reverseSeeded) {
      this.programmatic = true;
      this.scrollport.scrollLeft = this.loopW;
      this.reverseSeeded = true;
      this.endProgrammatic();
    }
  };

  NativeMarquee.prototype.step = function (dt) {
    if (!this.autoRun || this.loopW < 1) return;
    var sp = this.scrollport;
    var spd = (this.loopW / loopSeconds(this.track)) * dt;

    this.programmatic = true;
    if (this.rev > 0) {
      sp.scrollLeft += spd;
      if (sp.scrollLeft >= this.loopW - 0.5) {
        sp.scrollLeft -= this.loopW;
      }
    } else {
      sp.scrollLeft -= spd;
      if (sp.scrollLeft <= 0.5) {
        sp.scrollLeft += this.loopW;
      }
    }
    this.endProgrammatic();
  };

  NativeMarquee.prototype.onScroll = function () {
    var self = this;
    if (self.programmatic) return;
    self.autoRun = false;
    self.clearResume();
    if (self.scrollEndTimer) {
      clearTimeout(self.scrollEndTimer);
      self.scrollEndTimer = null;
    }
    self.scrollEndTimer = setTimeout(function () {
      self.scrollEndTimer = null;
      self.armResume();
    }, SCROLL_END_DEBOUNCE_MS);
  };

  NativeMarquee.prototype.bind = function () {
    var self = this;
    this.scrollport.addEventListener(
      'scroll',
      function () {
        self.onScroll();
      },
      { passive: true }
    );

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        self.measure();
      });
      ro.observe(this.scrollport);
      ro.observe(this.track);
      var fe = this.track.firstElementChild;
      if (fe) ro.observe(fe);
      var se = this.track.children[1];
      if (se) ro.observe(se);
    }

    window.addEventListener('resize', function () {
      self.measure();
    });
    window.addEventListener('orientationchange', function () {
      self.measure();
    });
    window.addEventListener('load', function () {
      self.measure();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        self.measure();
      });
    }
    this.track.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) {
        img.addEventListener(
          'load',
          function () {
            self.measure();
          },
          { once: true }
        );
      }
    });

    this.measure();
  };

  function globalTick(now) {
    if (!lastGlobalT) lastGlobalT = now;
    var dt = Math.min((now - lastGlobalT) / 1000, 0.05);
    lastGlobalT = now;
    for (var i = 0; i < instances.length; i++) {
      instances[i].step(dt);
    }
    rafId = requestAnimationFrame(globalTick);
  }

  function init() {
    if (reduced) return;

    document.querySelectorAll(SCROLLPORT_SEL).forEach(function (sp) {
      if (sp.getAttribute('data-marquee-native') === '1') return;
      var track = sp.querySelector('.gallery-track, .testimonial-track');
      if (!track) return;

      sp.setAttribute('data-marquee-native', '1');
      sp.classList.add('marquee-native-active');
      track.classList.add('marquee-js-active');
      track.style.animation = 'none';
      track.style.transform = '';

      var m = new NativeMarquee(sp, track);
      m.bind();
      instances.push(m);
    });

    if (instances.length && !rafId) {
      rafId = requestAnimationFrame(globalTick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
