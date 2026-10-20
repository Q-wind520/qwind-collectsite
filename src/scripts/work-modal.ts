const dialog = document.querySelector<HTMLDialogElement>('[data-work-modal]');
const frame = document.querySelector<HTMLIFrameElement>('[data-work-modal-frame]');
const loading = document.querySelector<HTMLElement>('[data-work-modal-loading]');
const closeButton = document.querySelector<HTMLButtonElement>('[data-work-modal-close]');

if (dialog && frame) {
  let lastTrigger: HTMLElement | null = null;
  let originalTitle = document.title;

  const modalSource = (href: string) => {
    const url = new URL(href, location.href);
    url.searchParams.set('embed', '1');
    return url.href;
  };

  const closeNow = () => {
    if (!dialog.open) return;
    dialog.close();
  };

  const requestClose = () => {
    if (history.state?.workModal) {
      history.back();
      return;
    }
    closeNow();
  };

  const openFor = (href: string, trigger: HTMLElement | null, push: boolean) => {
    if (push) history.pushState({ workModal: true }, '', href);
    lastTrigger = trigger ?? lastTrigger;
    if (!dialog.open) {
      originalTitle = document.title;
      document.documentElement.classList.add('modal-open');
      dialog.showModal();
    }
    if (loading) loading.hidden = false;
    frame.src = modalSource(href);
  };

  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-work-modal-link]');
    if (!link) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openFor(link.href, link, true);
  });

  closeButton?.addEventListener('click', requestClose);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) requestClose();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestClose();
  });
  dialog.addEventListener('close', () => {
    frame.src = 'about:blank';
    document.documentElement.classList.remove('modal-open');
    document.title = originalTitle;
    lastTrigger?.focus();
  });

  frame.addEventListener('load', () => {
    if (loading) loading.hidden = true;
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      if (doc.title) document.title = doc.title;
      doc.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !doc.querySelector('.pswp')) requestClose();
      });
      doc.addEventListener('click', (event) => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a');
        if (!link || link.hasAttribute('data-pswp') || link.target === '_blank') return;
        if (link.getAttribute('href')?.startsWith('#')) return;
        event.preventDefault();
        location.href = link.href;
      });
    } catch {
      // Cross-origin previews keep the gallery title.
    }
  });

  window.addEventListener('popstate', (event) => {
    if (event.state?.workModal) {
      openFor(location.href, null, false);
      return;
    }
    if (dialog.open) closeNow();
  });
}

export {};
