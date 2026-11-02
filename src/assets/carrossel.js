/* Native scrolling handles touch, trackpad and the no-JS fallback. No autoplay. */
(function () {
  'use strict';
  const root = document.querySelector('.photo-carousel');
  if (!root) return;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const controls = root.querySelector('.carousel-controls');
  const previous = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  const status = root.querySelector('.carousel-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!slides.length || typeof track.scrollTo !== 'function') return;

  function positions() {
    const origin = slides[0].getBoundingClientRect().left;
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    return slides.map(function (slide) {
      return Math.max(0, Math.min(maximum,
        slide.getBoundingClientRect().left - origin));
    });
  }
  function currentIndex() {
    const offsets = positions();
    return offsets.reduce(function (closest, offset, index) {
      return Math.abs(offset - track.scrollLeft) < Math.abs(offsets[closest] - track.scrollLeft) ? index : closest;
    }, 0);
  }
  function update() {
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maximum - 2;
    status.textContent = 'Foto ' + (currentIndex() + 1) + ' de ' + slides.length;
  }
  function goTo(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({left: positions()[target], behavior: reducedMotion.matches ? 'auto' : 'smooth'});
  }
  previous.addEventListener('click', function () { goTo(currentIndex() - 1); });
  next.addEventListener('click', function () { goTo(currentIndex() + 1); });
  track.addEventListener('keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const index = currentIndex();
    const destinations = {ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1};
    if (!Object.prototype.hasOwnProperty.call(destinations, event.key)) return;
    event.preventDefault();
    goTo(destinations[event.key]);
  });
  track.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  controls.hidden = false;
  status.hidden = false;
  update();
})();
