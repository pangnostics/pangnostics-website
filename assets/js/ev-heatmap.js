/* This viewer uses the same unmodified PNG as the page figure. */
(() => {
  const trigger = document.querySelector('.ev-heatmap-enlarge');
  const dialog = document.getElementById('ev-heatmap-dialog');
  if (!trigger || !dialog) return;
  const close = dialog.querySelector('.heatmap-dialog-close');
  const zoom = dialog.querySelector('.heatmap-dialog-zoom');
  const viewport = dialog.querySelector('.heatmap-dialog-viewport');
  const setZoom = enlarged => {
    dialog.classList.toggle('is-zoomed', enlarged);
    zoom.setAttribute('aria-pressed', String(enlarged));
    const label = enlarged ? 'Fit heatmap to window' : 'Zoom in on heatmap';
    zoom.setAttribute('aria-label', label);
    zoom.title = label;
    viewport.scrollTo(0, 0);
  };
  trigger.addEventListener('click', () => {
    setZoom(false);
    dialog.showModal();
    document.documentElement.classList.add('heatmap-modal-open');
    document.body.classList.add('heatmap-modal-open');
    close.focus({preventScroll: true});
  });
  close.addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => setZoom(!dialog.classList.contains('is-zoomed')));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  // Native dialog handles Escape and keeps keyboard focus within the viewer.
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('heatmap-modal-open');
    document.body.classList.remove('heatmap-modal-open');
    setZoom(false);
    trigger.focus({preventScroll: true});
  });
})();
