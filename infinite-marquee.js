/**
 * 作品选集 / 客户评价 — 原生无缝横滚（非 Swiper）
 * - 双列 DOM + 像素归位；跳转帧 transition: none
 * - 仅 translate3d + 单例 rAF；交互时自动播放完全停止，松手/惯性结束后再延迟 3s 恢复
 * - touchRatio≈1.5、coalesced pointer 事件、touch-action: none 减少与浏览器手势对抗
 */
(function () {
  var SELECTOR = '.isometric-gallery .gallery-track, .testimonials-masonry .testimonial-track';
  var RESUME_MS = 3000;
  var TOUCH_RATIO = 1.5;
  var VEL_THRESHOLD = 80;
  var VEL_STOP = 12;
  var INERTIA_DECAY = 4.2;

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

  function loopWidthFromTrack(track) {
    var first = track.firstElementChild;
    if (!first) return 0;
    var second = track.children[1];
    var w = 0;
    if (second) {
      w = second.offsetLeft - first.offsetLeft;
    }
    if (w < 1) {
      w = first.offsetWidth;
    }
    if (w < 1) {
      w = first.getBoundingClientRect().width;
    }
    return w;
  }

  function MarqueeController(track) {
    this.track = track;
    this.loopW = 0;
    this.x = 0;
    this.dragging = false;
    this.inertia = false;
    this.velocity = 0;
    this.lastClientX = 0;
    this.lastMoveT = 0;
    this.activePointer = null;
    this.autoplayOn = true;
    this.resumeTimer = null;
    this.hoverPause = false;
    this.lastT = 0;
  }

  MarqueeController.prototype.clearResume = function () {
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
  };

  MarqueeController.prototype.armResume = function () {
    var self = this;
    this.clearResume();
    this.resumeTimer = setTimeout(function () {
      self.resumeTimer = null;
      if (!self.dragging && !self.inertia && !self.hoverPause) {
        self.autoplayOn = true;
      }
    }, RESUME_MS);
  };

  MarqueeController.prototype.stopAutoplayNow = function () {
    this.autoplayOn = false;
    this.clearResume();
  };

  MarqueeController.prototype.normalize = function () {
    if (this.loopW <= 0) return false;
    var wrapped = false;
    while (this.x <= -this.loopW) {
      this.x += this.loopW;
      wrapped = true;
    }
    while (this.x > 0) {
      this.x -= this.loopW;
      wrapped = true;
    }
    return wrapped;
  };

  MarqueeController.prototype.paint = function (noTransition) {
    var t = this.track;
    if (noTransition) {
      t.style.transition = 'none';
    }
    t.style.transform = 'translate3d(' + this.x + 'px,0,0)';
    if (noTransition) {
      void t.offsetHeight;
      t.style.removeProperty('transition');
    }
  };

  MarqueeController.prototype.measure = function () {
    var w = loopWidthFromTrack(this.track);
    if (w < 1) return;
    this.loopW = w;
    this.normalize();
    this.paint(false);
  };

  MarqueeController.prototype.step = function (dt) {
    var rev = isReverseTrack(this.track) ? -1 : 1;
    var canAutoplay =
      this.autoplayOn &&
      !this.dragging &&
      !this.inertia &&
      !this.hoverPause &&
      this.loopW > 0;

    if (this.dragging) {
      /* 位移仅在 pointermove 中更新 */
    } else if (this.inertia) {
      this.x += this.velocity * dt;
      this.velocity *= Math.exp(-dt * INERTIA_DECAY);
      if (Math.abs(this.velocity) < VEL_STOP) {
        this.inertia = false;
        this.velocity = 0;
        this.track.classList.remove('marquee-interacting');
        this.armResume();
      }
    } else if (canAutoplay) {
      var spd = this.loopW / loopSeconds(this.track);
      this.x -= rev * spd * dt;
    }

    if (this.loopW > 0 && !this.dragging) {
      var wrapped = this.normalize();
      this.paint(!!wrapped);
    }
  };

  MarqueeController.prototype.bind = function () {
    var self = this;
    var track = this.track;

    function onDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      self.stopAutoplayNow();
      self.dragging = true;
      self.inertia = false;
      self.velocity = 0;
      track.classList.add('marquee-interacting');
      self.lastClientX = e.clientX;
      self.lastMoveT =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      self.activePointer = e.pointerId;
      try {
        track.setPointerCapture(e.pointerId);
      } catch (err) {}
      if (e.pointerType === 'touch') {
        try {
          e.preventDefault();
        } catch (e2) {}
      }
    }

    function applyMove(clientX, now, pointerType) {
      var mult = pointerType === 'touch' ? TOUCH_RATIO : 1;
      var dx = (clientX - self.lastClientX) * mult;
      var dt = Math.max((now - self.lastMoveT) / 1000, 0.001);
      self.x += dx;
      self.lastClientX = clientX;
      var rawV = dx / dt;
      self.velocity = self.velocity * 0.15 + rawV * 0.85;
      self.lastMoveT = now;
      self.normalize();
      self.paint(false);
    }

    function onMove(e) {
      if (!self.dragging || e.pointerId !== self.activePointer) return;
      if (e.getCoalescedEvents && e.getCoalescedEvents().length > 0) {
        var list = e.getCoalescedEvents();
        for (var i = 0; i < list.length; i++) {
          var ev = list[i];
          var ts =
            typeof ev.timeStamp === 'number'
              ? ev.timeStamp
              : typeof performance !== 'undefined'
                ? performance.now()
                : Date.now();
          applyMove(ev.clientX, ts, e.pointerType);
        }
      } else {
        var n =
          typeof performance !== 'undefined' ? performance.now() : Date.now();
        applyMove(e.clientX, n, e.pointerType);
      }
      if (e.pointerType === 'touch' && self.dragging) {
        try {
          e.preventDefault();
        } catch (e3) {}
      }
    }

    function onUp(e) {
      if (!self.dragging || e.pointerId !== self.activePointer) return;
      self.dragging = false;
      self.activePointer = null;
      try {
        track.releasePointerCapture(e.pointerId);
      } catch (err2) {}
      if (Math.abs(self.velocity) >= VEL_THRESHOLD) {
        self.inertia = true;
      } else {
        self.velocity = 0;
        track.classList.remove('marquee-interacting');
        self.armResume();
      }
    }

    function onCancel(e) {
      if (!self.dragging || e.pointerId !== self.activePointer) return;
      self.dragging = false;
      self.activePointer = null;
      self.inertia = false;
      self.velocity = 0;
      track.classList.remove('marquee-interacting');
      try {
        track.releasePointerCapture(e.pointerId);
      } catch (ce) {}
      self.armResume();
    }

    function onLostCapture(e) {
      if (self.dragging && e.pointerId === self.activePointer) {
        self.dragging = false;
        self.activePointer = null;
        if (!self.inertia) {
          track.classList.remove('marquee-interacting');
          self.armResume();
        }
      }
    }

    function onEnter(e) {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') return;
      self.hoverPause = true;
      self.stopAutoplayNow();
    }

    function onLeave(e) {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') return;
      self.hoverPause = false;
      if (!self.dragging && !self.inertia) {
        self.armResume();
      }
    }

    track.addEventListener('pointerdown', onDown, { passive: false });
    track.addEventListener('pointermove', onMove, { passive: false });
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onCancel);
    track.addEventListener('lostpointercapture', onLostCapture);
    track.addEventListener('pointerenter', onEnter);
    track.addEventListener('pointerleave', onLeave);

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        self.measure();
      });
      ro.observe(track);
      var fe = track.firstElementChild;
      if (fe) ro.observe(fe);
      var se = track.children[1];
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
    track.querySelectorAll('img').forEach(function (img) {
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
    var dt = Math.min((now - lastGlobalT) / 1000, 0.048);
    lastGlobalT = now;
    for (var i = 0; i < instances.length; i++) {
      instances[i].step(dt);
    }
    rafId = requestAnimationFrame(globalTick);
  }

  function init() {
    if (reduced) return;
    document.querySelectorAll(SELECTOR).forEach(function (track) {
      if (track.getAttribute('data-infinite-marquee') === '1') return;
      track.setAttribute('data-infinite-marquee', '1');
      track.classList.add('marquee-js-active');
      track.style.animation = 'none';

      var c = new MarqueeController(track);
      c.bind();
      instances.push(c);
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
