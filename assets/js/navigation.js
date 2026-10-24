/* Shared navigation for ordinary static HTML pages. */
(() => {
  const toggle = document.getElementById('menu');
  const nav = document.getElementById('navlinks');
  const trigger = nav.querySelector('.dropbtn');
  const mobile = () => matchMedia('(max-width:850px)').matches;
  const flyout = document.createElement('div');
  flyout.id = 'applications-flyout';
  flyout.innerHTML = '<a href="ev-analysis.html">EV Analysis</a><a href="antibody-analysis.html">Antibody Analysis</a>';
  document.body.append(flyout);
  trigger.setAttribute('aria-controls', flyout.id);
  trigger.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  let timer;
  const closeFlyout = () => {
    clearTimeout(timer);
    flyout.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const openFlyout = () => {
    if (mobile()) return;
    clearTimeout(timer);
    const rect = trigger.getBoundingClientRect();
    flyout.style.left = Math.max(8, Math.min(rect.left - 15, innerWidth - 230)) + 'px';
    flyout.style.top = rect.bottom + 2 + 'px';
    flyout.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  };
  const closeNav = () => {
    nav.classList.remove('open', 'mobile-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    nav.classList.toggle('mobile-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  });
  trigger.addEventListener('mouseenter', openFlyout);
  trigger.addEventListener('focus', openFlyout);
  trigger.addEventListener('click', () => {
    if (mobile()) {
      nav.querySelector('.dropdown a').focus();
      return;
    }
    // A pointer press follows mouseenter; keep the just-opened menu available.
    openFlyout();
    flyout.querySelector('a').focus();
  });
  trigger.closest('.drop').addEventListener('mouseleave', () => { timer = setTimeout(closeFlyout, 250); });
  flyout.addEventListener('mouseenter', () => clearTimeout(timer));
  flyout.addEventListener('focusin', () => clearTimeout(timer));
  flyout.addEventListener('mouseleave', () => { timer = setTimeout(closeFlyout, 250); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    if (!trigger.contains(event.target) && !flyout.contains(event.target)) closeFlyout();
  });
  document.addEventListener('focusin', event => {
    if (!trigger.contains(event.target) && !flyout.contains(event.target)) closeFlyout();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (flyout.classList.contains('open')) { closeFlyout(); trigger.focus(); closeFlyout(); }
    const returnToMenu = nav.classList.contains('open') && nav.contains(document.activeElement);
    closeNav();
    if (returnToMenu) toggle.focus();
  });
  window.addEventListener('resize', () => { closeFlyout(); if (!mobile()) closeNav(); });
  window.addEventListener('scroll', closeFlyout, { passive: true });
  const footer = document.querySelector('.pang-footer-applications');
  const footerButton = footer.querySelector('button');
  const footerPopup = footer.querySelector('nav');
  footerPopup.id = 'footer-applications-menu';
  footerButton.setAttribute('aria-controls', footerPopup.id);
  let footerOpenedByHover = false;
  const closeFooter = () => { footerOpenedByHover = false; footer.classList.remove('is-open'); footerButton.setAttribute('aria-expanded', 'false'); };
  footer.addEventListener('mouseenter', () => { if (!footer.classList.contains('is-open')) footerOpenedByHover = true; footer.classList.add('is-open'); footerButton.setAttribute('aria-expanded', 'true'); });
  footer.addEventListener('mouseleave', () => { if (!footer.contains(document.activeElement)) closeFooter(); });
  footer.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeFooter(); footerButton.focus(); }
  });
  footer.addEventListener('focusout', event => { if (!footer.contains(event.relatedTarget)) closeFooter(); });
  document.addEventListener('click', event => { if (!footer.contains(event.target)) closeFooter(); });
  footerButton.addEventListener('click', () => {
    const open = footerOpenedByHover || footerButton.getAttribute('aria-expanded') !== 'true';
    footerOpenedByHover = false;
    footer.classList.toggle('is-open', open);
    footerButton.setAttribute('aria-expanded', String(open));
    if (open) footer.querySelector('a').focus();
  });
  document.querySelector('.skip-link').addEventListener('click', () => {
    document.getElementById('main-content').focus({preventScroll:true});
  });
  const routes = {home:'index.html', 'ev-analysis':'ev-analysis.html', 'antibody-analysis':'antibody-analysis.html', company:'company.html'};
  // Preserve incoming bookmarks from the supplied hash-routed draft.
  const legacy = routes[location.hash.slice(1)];
  if (legacy && legacy !== document.body.dataset.pageFile) location.replace(legacy);
})();
