const dialog = document.querySelector<HTMLDialogElement>('[data-preview-dialog]');
const body = document.querySelector<HTMLElement>('[data-preview-body]');
const close = document.querySelector<HTMLButtonElement>('[data-preview-close]');

for (const row of document.querySelectorAll<HTMLElement>('[data-file-row]')) {
  row.querySelector<HTMLButtonElement>('[data-preview]')?.addEventListener('click', () => {
    if (!dialog || !body) return;
    const href = row.dataset.href || '';
    const mime = row.dataset.mime || '';
    body.innerHTML = '';
    if (mime.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = href;
      img.alt = '';
      body.append(img);
    } else if (mime === 'application/pdf') {
      const frame = document.createElement('iframe');
      frame.src = href;
      frame.title = 'PDF 预览';
      body.append(frame);
    }
    dialog.showModal();
  });
}

close?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

export {};
