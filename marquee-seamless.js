/**
 * 横滚无缝：用首组 loop 的实际像素宽度作为位移终点，
 * 避免纯 CSS translate(-50%) 与真实半宽亚像素不一致导致循环处断层。
 */
(function () {
  var SELECTOR = '.gallery-track, .testimonial-track';

  function measureTrack(track) {
    var first = track.firstElementChild;
    if (!first) return;
    var w = first.getBoundingClientRect().width;
    if (w < 1) return;
    track.style.setProperty('--marquee-shift', w.toFixed(3) + 'px');
    track.setAttribute('data-marquee-ready', 'true');
  }

  function measureAll() {
    document.querySelectorAll(SELECTOR).forEach(measureTrack);
  }

  var raf = null;
  function scheduleMeasure() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      raf = null;
      measureAll();
    });
  }

  function init() {
    measureAll();
    var ro = new ResizeObserver(scheduleMeasure);
    document.querySelectorAll(SELECTOR).forEach(function (track) {
      ro.observe(track);
      var first = track.firstElementChild;
      if (first) ro.observe(first);
    });
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('orientationchange', scheduleMeasure);
    window.addEventListener('load', scheduleMeasure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleMeasure);
    }
    document.querySelectorAll(SELECTOR + ' img').forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', scheduleMeasure, { once: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
