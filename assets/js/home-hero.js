/* Local MP4 background: autoplay in view, pause offscreen/hidden, honor reduced motion. */
(() => {
  const hero = document.querySelector('.home-hero');
  if (!hero) return;
  const video = hero.querySelector('video');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let failed = false;
  let pendingPlay = null;

  video.muted = true;
  video.defaultMuted = true;
  const shouldPlay = () => inView && !document.hidden && !motion.matches && !failed;
  function sync() {
    if (!shouldPlay()) { video.pause(); return; }
    if (!video.hasAttribute('src')) { video.src = video.dataset.src; video.load(); }
    if (!video.paused || pendingPlay) return;
    pendingPlay = video.play();
    if (pendingPlay) {
      pendingPlay.catch(() => {
        // Retain the still poster when the browser blocks automatic playback.
      }).finally(() => {
        pendingPlay = null;
        if (!shouldPlay()) video.pause();
      });
    }
  }
  video.addEventListener('playing', () => video.classList.add('is-ready'));
  video.addEventListener('error', () => {
    failed = true;
    video.classList.remove('is-ready');
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', sync);
  motion.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
      sync();
    }, {threshold:[0,.15]}).observe(hero);
  } else {
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      inView = r.bottom > r.height*.15 && r.top < innerHeight-r.height*.15;
      sync();
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});
    onScroll();
  }
})();
