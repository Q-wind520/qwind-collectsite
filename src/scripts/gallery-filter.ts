const form = document.querySelector<HTMLFormElement>('[data-filter-form]');
const grid = document.querySelector<HTMLElement>('[data-gallery-grid]');
const count = document.querySelector<HTMLElement>('[data-result-count]');
const empty = document.querySelector<HTMLElement>('[data-gallery-empty]');
const title = document.querySelector<HTMLElement>('[data-gallery-title]');
const description = document.querySelector<HTMLElement>('[data-gallery-desc]');

const FIELDS = ['artist', 'rating', 'tag', 'sort'] as const;

const KIND_META = {
  painting: { title: '画作', desc: '原图与提示词。点击图片看大图，点标题进入详情。' },
  style: { title: '画风', desc: '画师串与参考图。用画风条目记录喜欢的画师组合。' },
  composition: { title: '构图', desc: '构图串 / 场景串与参考图。' },
} as const;

type Kind = keyof typeof KIND_META;

function currentKind(): Kind {
  const value = new URLSearchParams(location.search).get('kind');
  return value === 'style' || value === 'composition' ? value : 'painting';
}

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
  const kind = currentKind();
  const filter = readFilter(form);
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-work]')];

  for (const card of cards) {
    const kindMatch = (card.dataset.kind || 'painting') === kind;
    if (card.dataset.protected === 'true') {
      card.hidden = !kindMatch || Boolean(filter.artist || filter.rating || filter.tag);
      continue;
    }
    const artistMatch = !filter.artist || (card.dataset.artists || '').split(' ').includes(filter.artist);
    const ratingMatch = !filter.rating || card.dataset.rating === filter.rating;
    const tagMatch = !filter.tag || (card.dataset.tags || '').split('|').includes(filter.tag);
    card.hidden = !(kindMatch && artistMatch && ratingMatch && tagMatch);
  }

  const visible = cards.filter((card) => !card.hidden);
  const sorted = [...visible].sort((a, b) => {
    if (filter.sort === 'random') return Math.random() - 0.5;
    const delta = (a.dataset.date || '').localeCompare(b.dataset.date || '');
    return filter.sort === 'oldest' ? delta : -delta;
  });
  for (const card of sorted) grid.appendChild(card);

  const publicVisible = visible.filter((card) => card.dataset.protected !== 'true').length;
  if (count) count.textContent = `${publicVisible} 件作品`;
  if (empty) empty.hidden = publicVisible > 0;

  const meta = KIND_META[kind];
  if (title) title.textContent = meta.title;
  if (description) description.textContent = meta.desc;
  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-kind-link]')) {
    if (link.dataset.kindLink === kind) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  const params = new URLSearchParams();
  if (kind !== 'painting') params.set('kind', kind);
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

export {};
