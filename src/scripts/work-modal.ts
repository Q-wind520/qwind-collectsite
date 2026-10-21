type WorkDetail = {
  title: string;
  summary: string;
  date: string;
  kind: string;
  rating: string;
  model: string;
  artists: string;
  tags: { label: string; href: string | null }[];
  image: { src: string; width: number; height: number; alt: string };
  positive: string;
  positiveLabel: string;
  positiveAction: string;
  negative: string;
  href: string;
};

const dialog = document.querySelector<HTMLDialogElement>('[data-work-modal]');

if (dialog) {
  const image = dialog.querySelector<HTMLImageElement>('[data-work-modal-image]');
  const kicker = dialog.querySelector<HTMLElement>('[data-work-modal-kicker]');
  const title = dialog.querySelector<HTMLElement>('[data-work-modal-title]');
  const summary = dialog.querySelector<HTMLElement>('[data-work-modal-summary]');
  const date = dialog.querySelector<HTMLElement>('[data-work-modal-date]');
  const artists = dialog.querySelector<HTMLElement>('[data-work-modal-artists]');
  const model = dialog.querySelector<HTMLElement>('[data-work-modal-model]');
  const rating = dialog.querySelector<HTMLElement>('[data-work-modal-rating]');
  const tags = dialog.querySelector<HTMLElement>('[data-work-modal-tags]');
  const positiveLabel = dialog.querySelector<HTMLElement>('[data-work-modal-positive-label]');
  const positive = dialog.querySelector<HTMLElement>('[data-work-modal-positive]');
  const negative = dialog.querySelector<HTMLElement>('[data-work-modal-negative]');
  const positiveButton = dialog.querySelector<HTMLButtonElement>('[data-copy-modal-positive]');
  const negativeButton = dialog.querySelector<HTMLButtonElement>('[data-copy-modal-negative]');
  const more = dialog.querySelector<HTMLAnchorElement>('[data-work-modal-more]');
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-work-modal-close]');

  let current: WorkDetail | null = null;
  let lastTrigger: HTMLElement | null = null;
  let originalTitle = document.title;

  const copy = async (text: string, button: HTMLButtonElement) => {
    if (!text) return;
    const previous = button.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    button.textContent = '已复制';
    window.setTimeout(() => { button.textContent = previous; }, 1200);
  };

  const setText = (element: HTMLElement | null, value: string) => {
    if (element) element.textContent = value;
  };

  const populate = (item: WorkDetail) => {
    if (image) {
      image.src = item.image.src;
      image.alt = item.image.alt;
      image.width = item.image.width;
      image.height = item.image.height;
    }
    setText(kicker, `WORK / ${item.kind} / ${item.rating.toUpperCase()}`);
    setText(title, item.title);
    setText(summary, item.summary);
    if (summary) summary.hidden = !item.summary;
    setText(date, item.date);
    setText(artists, item.artists);
    setText(model, item.model);
    setText(rating, item.rating);

    if (tags) {
      tags.replaceChildren(...item.tags.map((tag) => {
        if (!tag.href) {
          const span = document.createElement('span');
          span.textContent = `#${tag.label}`;
          return span;
        }
        const link = document.createElement('a');
        link.href = tag.href;
        link.textContent = `#${tag.label}`;
        return link;
      }));
    }

    setText(positiveLabel, item.positiveLabel);
    setText(positive, item.positive || '—');
    setText(negative, item.negative || '—');
    if (positiveButton) {
      positiveButton.textContent = item.positiveAction;
      positiveButton.disabled = !item.positive;
    }
    if (negativeButton) negativeButton.disabled = !item.negative;
    if (more) more.href = item.href;
  };

  const openFor = (item: WorkDetail, href: string, trigger: HTMLElement | null, push: boolean) => {
    if (push) history.pushState({ workModal: true }, '', href);
    lastTrigger = trigger ?? lastTrigger;
    current = item;
    populate(item);
    if (!dialog.open) {
      originalTitle = document.title;
      document.documentElement.classList.add('modal-open');
      dialog.showModal();
    }
    document.title = item.title;
  };

  const closeNow = () => {
    if (dialog.open) dialog.close();
  };

  const requestClose = () => {
    if (!dialog.open) return;
    const shouldGoBack = Boolean(history.state?.workModal);
    closeNow();
    if (shouldGoBack) history.back();
  };

  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-work-modal-link]');
    if (!link) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const dataElement = link.closest('[data-work]')?.querySelector<HTMLScriptElement>('script[data-work-data]');
    if (!dataElement?.textContent) return;
    let item: WorkDetail;
    try {
      item = JSON.parse(dataElement.textContent) as WorkDetail;
    } catch {
      return;
    }
    event.preventDefault();
    openFor(item, link.href, link, true);
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
    document.documentElement.classList.remove('modal-open');
    document.title = originalTitle;
    lastTrigger?.focus();
  });

  positiveButton?.addEventListener('click', () => {
    if (current) copy(current.positive, positiveButton);
  });
  negativeButton?.addEventListener('click', () => {
    if (current) copy(current.negative, negativeButton);
  });

  window.addEventListener('popstate', (event) => {
    if (event.state?.workModal && current) {
      openFor(current, location.href, null, false);
      return;
    }
    if (dialog.open) closeNow();
  });
}

export {};
