import { searchEntries, type SearchEntry } from '../lib/search';
import { withBase } from '../lib/url';

const roots = [...document.querySelectorAll<HTMLElement>('[data-search-root]')];
const searchDialog = document.querySelector<HTMLDialogElement>('[data-search-dialog]');

searchDialog?.addEventListener('click', (event) => {
  if (event.target === searchDialog) searchDialog.close();
});

if (roots.length > 0) {
  let indexPromise: Promise<SearchEntry[]> | null = null;
  const load = () => (indexPromise ??= fetch(withBase('/search-index.json')).then((response) => response.json()));

  for (const root of roots) {
    const input = root.querySelector<HTMLInputElement>('[data-search-input]');
    const results = root.querySelector<HTMLElement>('[data-search-results]');
    if (!input || !results) continue;

    let entries: SearchEntry[] = [];
    let activeIndex = 0;
    load().then((data) => { entries = data; if (input.value) render(); });

    const render = () => {
      const query = input.value.trim();
      activeIndex = 0;
      if (!query) {
        results.innerHTML = '<p class="search-empty">输入标题、标签或正文关键词。</p>';
        return;
      }
      const nsfwOn = document.documentElement.dataset.nsfw === 'on';
      const visible = nsfwOn ? entries : entries.filter((entry) => !entry.nsfw);
      const found = searchEntries(visible, query);
      results.innerHTML = found.length
        ? found.map((entry) => `<a class="search-hit" href="${entry.url}"><span>${entry.type}</span><b>${escapeHtml(entry.title)}</b><small>${escapeHtml(entry.summary)}</small></a>`).join('')
        : '<p class="search-empty">没有找到匹配内容。</p>';
      highlight();
    };

    const hits = () => [...results.querySelectorAll<HTMLAnchorElement>('.search-hit')];
    const highlight = () => {
      hits().forEach((hit, index) => hit.classList.toggle('active', index === activeIndex));
    };

    input.addEventListener('input', render);
    document.addEventListener('nsfwchange', () => { if (input.value) render(); });
    input.addEventListener('keydown', (event) => {
      const items = hits();
      if (items.length === 0) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        highlight();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        items[activeIndex]?.click();
      }
    });
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character);
}

export {};
