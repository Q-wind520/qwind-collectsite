import { matchesWorkFilter } from '../lib/work-filter';

const form = document.querySelector<HTMLFormElement>('[data-filter-form]');
const grid = document.querySelector<HTMLElement>('[data-gallery-grid]');
const count = document.querySelector<HTMLElement>('[data-result-count]');
const empty = document.querySelector<HTMLElement>('[data-gallery-empty]');

const FIELDS = ['artist', 'rating', 'tier', 'experiment', 'sort'] as const;

function readFilter(formEl: HTMLFormElement) {
  const data = new FormData(formEl);
  return {
    artist: String(data.get('artist') || ''),
    rating: String(data.get('rating') || ''),
    tags: data.getAll('tag').map(String).filter(Boolean),
    tier: String(data.get('tier') || ''),
    experiment: String(data.get('experiment') || ''),
    sort: String(data.get('sort') || 'newest'),
  };
}

function apply() {
  if (!form || !grid) return;
  const filter = readFilter(form);
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-work]')];
  const nsfwOn = document.documentElement.dataset.nsfw === 'on';

  for (const card of cards) {
    const data = {
      nsfw: card.dataset.nsfw === 'true',
      artists: (card.dataset.artists || '').split(' ').filter(Boolean),
      rating: card.dataset.rating || '',
      tags: (card.dataset.tags || '').split('|').filter(Boolean),
      tier: card.dataset.tier || '',
      experiments: (card.dataset.experiments || '').split('|').filter(Boolean),
    };
    card.hidden = !matchesWorkFilter(data, filter, nsfwOn);
  }

  const visible = cards.filter((card) => !card.hidden);
  const sorted = [...visible].sort((a, b) => {
    if (filter.sort === 'random') return Math.random() - 0.5;
    const delta = (a.dataset.date || '').localeCompare(b.dataset.date || '');
    return filter.sort === 'oldest' ? delta : -delta;
  });
  for (const card of sorted) grid.appendChild(card);

  if (count) count.textContent = `${visible.length} 件作品`;
  if (empty) empty.hidden = visible.length > 0;

  const params = new URLSearchParams();
  if (filter.artist) params.set('artist', filter.artist);
  if (filter.rating) params.set('rating', filter.rating);
  for (const tag of filter.tags) params.append('tag', tag);
  if (filter.tier) params.set('tier', filter.tier);
  if (filter.experiment) params.set('experiment', filter.experiment);
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
  const selectedTags = params.getAll('tag');
  for (const checkbox of form.querySelectorAll<HTMLInputElement>('input[name="tag"]')) {
    checkbox.checked = selectedTags.includes(checkbox.value);
  }
  form.addEventListener('change', apply);
  form.addEventListener('reset', () => window.setTimeout(apply, 0));
  document.addEventListener('nsfwchange', apply);
  apply();
}

export {};
