document.addEventListener('click', async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-copy-text]');
  if (!button) return;
  const text = button.dataset.copyText || '';
  try {
    await navigator.clipboard.writeText(text);
    const previous = button.textContent;
    button.textContent = '已复制';
    window.setTimeout(() => { button.textContent = previous; }, 1200);
  } catch {
    button.textContent = '复制失败';
  }
});

export {};
