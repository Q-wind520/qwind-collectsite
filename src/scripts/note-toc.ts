const tocRoot = document.querySelector<HTMLElement>('[data-note-toc]');
const prose = document.querySelector<HTMLElement>('[data-note-prose]');

if (tocRoot && prose) {
  const details = tocRoot.querySelector<HTMLDetailsElement>('[data-toc-details]');
  const links = Array.from(tocRoot.querySelectorAll<HTMLAnchorElement>('[data-toc-link]'));
  const bar = tocRoot.querySelector<HTMLElement>('[data-toc-progress]');
  const wide = window.matchMedia('(min-width: 1080px)');

  const syncOpen = () => {
    if (!details) return;
    details.open = wide.matches || document.documentElement.dataset.toc === 'open';
  };
  syncOpen();
  wide.addEventListener('change', syncOpen);
  document.addEventListener('settingschange', syncOpen);

  const targets = links
    .map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const heading = document.getElementById(id);
      return heading ? { link, heading } : null;
    })
    .filter((entry): entry is { link: HTMLAnchorElement; heading: HTMLElement } => entry !== null);

  let activeLink: HTMLAnchorElement | null = null;
  let frame = 0;

  const update = () => {
    frame = 0;

    const rect = prose.getBoundingClientRect();
    const total = Math.max(1, rect.height - window.innerHeight * 0.35);
    const read = Math.min(1, Math.max(0, (window.innerHeight * 0.35 - rect.top) / total));
    if (bar) bar.style.width = `${(read * 100).toFixed(2)}%`;

    let current: HTMLAnchorElement | null = targets[0]?.link ?? null;
    for (const { link, heading } of targets) {
      if (heading.getBoundingClientRect().top <= 120) current = link;
      else break;
    }

    if (current !== activeLink) {
      activeLink?.removeAttribute('aria-current');
      current?.setAttribute('aria-current', 'location');
      activeLink = current;
    }
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

export {};
