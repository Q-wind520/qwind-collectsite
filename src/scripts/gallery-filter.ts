const form = document.querySelector<HTMLFormElement>('[data-filter-form]');
const grid = document.querySelector<HTMLElement>('[data-gallery-grid]');
const count = document.querySelector<HTMLElement>('[data-result-count]');

const FIELDS = ['artist', 'rating', 'tag', 'sort'] as const;

function readFilter(formEl: HTMLFormElement) {
  const data = new FormData(formEl);
  return {
    artist: String(data.get('artist') || ''),
    rating: String(data.get('rating') || ''),
    tag: String(data.get('tag') || ''),
    sort: String(data.get('sort') || 'newest'),
  };
}

function apply() {
  if (!form || !grid) return;
  const filter = readFilter(form);
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-work]')];

  for (const card of cards) {
    if (card.dataset.protected === 'true') {
      card.hidden = Boolean(filter.artist || filter.rating || filter.tag);
      continue;
    }
    const artistMatch = !filter.artist || (card.dataset.artists || '').split(' ').includes(filter.artist);
    const ratingMatch = !filter.rating || card.dataset.rating === filter.rating;
    const tagMatch = !filter.tag || (card.dataset.tags || '').split('|').includes(filter.tag);
    card.hidden = !(artistMatch && ratingMatch && tagMatch);
  }

  const visible = cards.filter((card) => !card.hidden);
  const sorted = [...visible].sort((a, b) => {
    if (filter.sort === 'random') return Math.random() - 0.5;
    const delta = (a.dataset.date || '').localeCompare(b.dataset.date || '');
    return filter.sort === 'oldest' ? delta : -delta;
  });
  for (const card of sorted) grid.appendChild(card);

  if (count) count.textContent = `${visible.filter((card) => card.dataset.protected !== 'true').length} 件作品`;

  const params = new URLSearchParams();
  if (filter.artist) params.set('artist', filter.artist);
  if (filter.rating) params.set('rating', filter.rating);
  if (filter.tag) params.set('tag', filter.tag);
  if (filter.sort !== 'newest') params.set('sort', filter.sort);
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}`);
}

if (form && grid) {
  const params = new URLSearchParams(location.search);
  for (const field of FIELDS) {
    const control = form.elements.namedItem(field);
    if (control instanceof HTMLSelectElement && params.get(field)) {
      control.value = params.get(field)!;
    }
  }
  form.addEventListener('change', apply);
  form.addEventListener('reset', () => window.setTimeout(apply, 0));
  apply();
}
