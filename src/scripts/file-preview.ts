const dialog = document.querySelector<HTMLDialogElement>('[data-preview-dialog]');
const body = document.querySelector<HTMLElement>('[data-preview-body]');
for (const row of document.querySelectorAll<HTMLElement>('[data-file-row]')) {
  const previewButton = row.querySelector<HTMLButtonElement>('[data-preview]');
  const nameLink = row.querySelector<HTMLAnchorElement>('.name');

  previewButton?.addEventListener('click', () => {
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
    } else if (mime.startsWith('audio/')) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.preload = 'metadata';
      audio.src = href;
      body.append(audio);
    }
    dialog.showModal();
  });

  // Previewable files open the in-page dialog from the title too.
  if (previewButton && nameLink) {
    nameLink.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      previewButton.click();
    });
  }
}

const stopAudio = () => body?.querySelector('audio')?.pause();

dialog?.addEventListener('close', stopAudio);
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

export {};
