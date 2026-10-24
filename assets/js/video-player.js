/* Videos load only when requested. Paths are configured in videos.js. */
(() => {
  const videos = window.PANGNOSTICS_VIDEOS || {};
  const dialog = document.createElement('dialog');
  dialog.className = 'video-dialog';
  dialog.setAttribute('aria-labelledby', 'video-dialog-title');
  dialog.innerHTML = '<div class="video-dialog-bar"><span class="video-dialog-title" id="video-dialog-title"></span><button type="button" class="video-credit-toggle" aria-expanded="false" aria-controls="video-music-credit" hidden>Music credits</button><button type="button" class="video-dialog-close" aria-label="Close video">×</button></div><video controls playsinline preload="none"></video><p class="video-credit" id="video-music-credit" hidden></p><p class="video-error" role="status" hidden></p>';
  document.body.append(dialog);
  const player = dialog.querySelector('video');
  const close = dialog.querySelector('.video-dialog-close');
  const creditToggle = dialog.querySelector('.video-credit-toggle');
  const error = dialog.querySelector('.video-error');
  const credit = dialog.querySelector('.video-credit');
  const showCredit = music => {
    credit.replaceChildren();
    credit.hidden = true;
    creditToggle.hidden = !music;
    creditToggle.setAttribute('aria-expanded', 'false');
    if (!music) return;
    const link = (label, url) => {
      const anchor = document.createElement('a');
      anchor.textContent = label;
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      return anchor;
    };
    const changes = document.createElement('span');
    changes.className = 'video-credit-changes';
    changes.textContent = music.changes;
    credit.append('Music: ', link(music.track, music.trackUrl), ' by ',
      link(music.artist, music.artistUrl), '. Licensed under ',
      link(music.license, music.licenseUrl), '.', changes);
  };
  creditToggle.addEventListener('click', () => {
    credit.hidden = !credit.hidden;
    creditToggle.setAttribute('aria-expanded', String(!credit.hidden));
  });
  let previousFocus = null;
  const dismiss = () => { if (dialog.open) dialog.close(); };
  dialog.addEventListener('close', () => {
    player.pause();
    credit.hidden = true;
    creditToggle.setAttribute('aria-expanded', 'false');
    player.removeAttribute('src');
    player.load();
    document.body.classList.remove('video-modal-open');
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  });
  close.addEventListener('click', dismiss);
  dialog.addEventListener('click', event => { if (event.target === dialog) {const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dismiss();} });
  player.addEventListener('error', () => {
    if (!player.getAttribute('src')) return;
    error.textContent = 'This video could not be loaded. Please try again.';
    error.hidden = false;
  });
  document.querySelectorAll('[data-video]').forEach(trigger => {
    const video = videos[trigger.dataset.video];
    if (!video?.src) return;
    trigger.removeAttribute('aria-disabled');
    trigger.setAttribute('aria-label', 'Play video: ' + video.title);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.tabIndex = 0;
    if (trigger.tagName !== 'BUTTON') trigger.setAttribute('role', 'button');
    trigger.classList.add('video-ready');
    const open = () => {
      previousFocus = trigger;
      error.hidden = true;
      showCredit(video.musicCredit);
      dialog.querySelector('.video-dialog-title').textContent = video.title;
      player.setAttribute('aria-label', video.title);
      const image = trigger.querySelector('img');
      if (image) player.poster = image.currentSrc || image.src;
      player.src = video.src;
      dialog.showModal();
      document.body.classList.add('video-modal-open');
      close.focus();
      player.play().catch(() => { /* Native controls remain available if play is blocked. */ });
    };
    trigger.addEventListener('click', open);
    if (trigger.tagName !== 'BUTTON') trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });
})();
