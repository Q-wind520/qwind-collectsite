import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const root = document.querySelector<HTMLElement>('[data-lightbox-root]');
if (root) {
  const selector = root.dataset.selector || '#gallery-grid';
  const lightbox = new PhotoSwipeLightbox({
    gallery: selector,
    children: 'a[data-pswp]',
    pswpModule: PhotoSwipe,
    bgOpacity: 0.92,
  });

  lightbox.on('uiRegister', () => {
    lightbox.pswp?.ui?.registerElement({
      name: 'prompt-panel',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '<div class="pswp__prompt"><div class="pswp__prompt-text"></div><div class="pswp__prompt-actions"><button type="button" data-copy-positive>复制正向</button><button type="button" data-copy-negative>复制负向</button></div></div>',
      onInit: (element, pswp) => {
        const text = element.querySelector<HTMLElement>('.pswp__prompt-text')!;
        const positiveButton = element.querySelector<HTMLButtonElement>('[data-copy-positive]')!;
        const negativeButton = element.querySelector<HTMLButtonElement>('[data-copy-negative]')!;
        const currentAnchor = () => pswp.currSlide?.data?.element as HTMLElement | undefined;
        const update = () => {
          const anchor = currentAnchor();
          const prompt = anchor?.dataset.promptPositive || '';
          text.textContent = prompt ? (prompt.length > 180 ? `${prompt.slice(0, 180)}…` : prompt) : '暂无提示词';
          positiveButton.onclick = () => navigator.clipboard.writeText(anchor?.dataset.promptPositive || '');
          negativeButton.onclick = () => navigator.clipboard.writeText(anchor?.dataset.promptNegative || '');
        };
        pswp.on('change', update);
        update();
      },
    });
  });

  lightbox.init();
}
