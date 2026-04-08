/**
 * 作品选集 / 客户评价：无缝循环 + 拖拽 + 松手惯性 + 交互后暂停、延迟恢复自动播放。
 * （项目未使用 Swiper/Framer Motion；无 JS 时回退为 style.css 中的 CSS @keyframes。）
 */
(function () {
  var SELECTOR = '.isometric-gallery .gallery-track, .testimonials-masonry .testimonial-track';
  var RESUME_MS = 3000;
  var VEL_THRESHOLD = 100;
  var VEL_STOP = 10;
  var INERTIA_DECAY = 3.4;

  var reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function bindTrack(track) {
    if (track.getAttribute('data-infinite-marquee') === '1') return;
    if (reduced) return;

    track.setAttribute('data-infinite-marquee', '1');
    track.classList.add('marquee-js-active');
    track.style.animation = 'none';

    var loopW = 0;
    var x = 0;
    var autoplayOff = false;
    var resumeTimer = null;
    var rafId = 0;
    var lastT = 0;
    var dragging = false;
    var inertia = false;
    var velocity = 0;
    var lastClientX = 0;
    var lastMoveT = 0;
    var activePointer = null;

    function clearResume() {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    }

    function armResume() {
      clearResume();
      resumeTimer = setTimeout(function () {
        resumeTimer = null;
        autoplayOff = false;
      }, RESUME_MS);
    }

    function normalize() {
      if (loopW <= 0) return;
      while (x <= -loopW) x += loopW;
      while (x > 0) x -= loopW;
    }

    function paint() {
      track.style.transform = 'translate3d(' + x + 'px,0,0)';
    }

    function measure() {
      var first = track.firstElementChild;
      if (!first) return;
      var w = first.getBoundingClientRect().width;
      if (w < 1) return;
      loopW = w;
      normalize();
      paint();
    }

    function tick(now) {
      if (!lastT) lastT = now;
      var dt = Math.min((now - lastT) / 1000, 0.07);
      lastT = now;
      var rev = isReverseTrack(track) ? -1 : 1;

      if (!dragging && inertia) {
        x += velocity * dt;
        velocity *= Math.exp(-dt * INERTIA_DECAY);
        if (Math.abs(velocity) < VEL_STOP) {
          inertia = false;
          velocity = 0;
          armResume();
        }
      } else if (!dragging && !inertia && !autoplayOff && loopW > 0) {
        var spd = loopW / loopSeconds(track);
        x -= rev * spd * dt;
      }

      if (loopW > 0) normalize();
      paint();
      rafId = requestAnimationFrame(tick);
    }

    function onDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      inertia = false;
      velocity = 0;
      autoplayOff = true;
      clearResume();
      lastClientX = e.clientX;
      lastMoveT = typeof performance !== 'undefined' ? performance.now() : Date.now();
      activePointer = e.pointerId;
      try {
        track.setPointerCapture(e.pointerId);
      } catch (err) {}
    }

    function onMove(e) {
      if (!dragging || e.pointerId !== activePointer) return;
      var clientX = e.clientX;
      var now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      var dx = clientX - lastClientX;
      var dt = Math.max((now - lastMoveT) / 1000, 0.008);
      x += dx;
      var rawV = dx / dt;
      velocity = velocity * 0.22 + rawV * 0.78;
      lastClientX = clientX;
      lastMoveT = now;
      normalize();
      paint();
    }

    function onUp(e) {
      if (!dragging || e.pointerId !== activePointer) return;
      dragging = false;
      activePointer = null;
      try {
        track.releasePointerCapture(e.pointerId);
      } catch (err2) {}
      if (Math.abs(velocity) >= VEL_THRESHOLD) {
        inertia = true;
      } else {
        velocity = 0;
        armResume();
      }
    }

    function onCancel(e) {
      onUp(e);
    }

    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onCancel);
    track.addEventListener('lostpointercapture', function (e) {
      if (dragging && e.pointerId === activePointer) {
        dragging = false;
        activePointer = null;
        if (!inertia) armResume();
      }
    });

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        measure();
      });
      ro.observe(track);
      var firstEl = track.firstElementChild;
      if (firstEl) ro.observe(firstEl);
    }

    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    track.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) {
        img.addEventListener('load', measure, { once: true });
      }
    });

    measure();
    rafId = requestAnimationFrame(tick);
  }

  function init() {
    document.querySelectorAll(SELECTOR).forEach(bindTrack);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
