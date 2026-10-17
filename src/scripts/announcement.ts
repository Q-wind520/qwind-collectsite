const notice = document.querySelector<HTMLElement>('[data-announcement]');
const close = document.querySelector<HTMLButtonElement>('[data-announcement-close]');
const key = 'qwind-announcement-dismissed';

if (notice && localStorage.getItem(key) === '1') {
  notice.hidden = true;
}

close?.addEventListener('click', () => {
  if (!notice) return;
  notice.hidden = true;
  localStorage.setItem(key, '1');
});

export {};
