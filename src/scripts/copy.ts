document.addEventListener('click', async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-copy-text]');
  if (!button) return;
  const text = button.dataset.copyText || '';
  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const previous = label?.textContent ?? button.textContent;
  const setLabel = (value: string) => {
    if (label) label.textContent = value;
    else button.textContent = value;
  };
  try {
    await navigator.clipboard.writeText(text);
    button.setAttribute('aria-live', 'polite');
    setLabel('已复制');
    window.setTimeout(() => setLabel(previous ?? ''), 1200);
  } catch {
    setLabel('复制失败');
  }
});

export {};
