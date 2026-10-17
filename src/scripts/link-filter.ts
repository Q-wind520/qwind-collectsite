const domainSelect = document.querySelector<HTMLSelectElement>('[data-link-domain]');
const tagSelect = document.querySelector<HTMLSelectElement>('[data-link-tag]');
const cards = [...document.querySelectorAll<HTMLElement>('[data-link-card]')];

function apply() {
  const domain = domainSelect?.value || '';
  const tag = tagSelect?.value || '';
  for (const card of cards) {
    const domainMatch = !domain || card.dataset.domain === domain;
    const tagMatch = !tag || (card.dataset.tags || '').split('|').includes(tag);
    card.hidden = !(domainMatch && tagMatch);
  }
}

domainSelect?.addEventListener('change', apply);
tagSelect?.addEventListener('change', apply);

export {};
