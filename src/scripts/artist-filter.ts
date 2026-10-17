const input = document.querySelector<HTMLInputElement>('[data-artist-search]');
const cards = [...document.querySelectorAll<HTMLElement>('[data-artist-card]')];

input?.addEventListener('input', () => {
  const query = input.value.trim().toLowerCase();
  for (const card of cards) {
    card.hidden = Boolean(query) && !(card.dataset.search || '').includes(query);
  }
});
