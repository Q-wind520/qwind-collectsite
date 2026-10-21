const GAP = 12;
const MOBILE_QUERY = '(max-width: 760px)';

const grids = [...document.querySelectorAll<HTMLElement>('[data-masonry]')];

if (grids.length > 0) {
  const state = new WeakMap<HTMLElement, number>();

  const columnsFor = (grid: HTMLElement) => {
    const max = Number(grid.dataset.masonryColumns) || 3;
    return window.matchMedia(MOBILE_QUERY).matches ? Math.min(2, max) : max;
  };

  const layout = (grid: HTMLElement) => {
    const cards = [...grid.children].filter((child): child is HTMLElement =>
      child instanceof HTMLElement && child.getClientRects().length > 0);

    const width = grid.clientWidth;
    if (width <= 0) return;

    grid.classList.add('masonry-ready');
    const columns = columnsFor(grid);
    const columnWidth = Math.max(0, (width - GAP * (columns - 1)) / columns);
    const heights = new Array<number>(columns).fill(0);

    for (const card of cards) {
      card.style.width = `${columnWidth}px`;
      const height = card.getBoundingClientRect().height;
      let target = 0;
      for (let index = 1; index < columns; index += 1) {
        if (heights[index] < heights[target]) target = index;
      }
      card.style.left = `${target * (columnWidth + GAP)}px`;
      card.style.top = `${heights[target]}px`;
      heights[target] += height + GAP;
    }

    for (const child of grid.children) {
      if (!(child instanceof HTMLElement) || child.getClientRects().length > 0) continue;
      child.style.left = '';
      child.style.top = '';
      child.style.width = '';
    }

    grid.style.height = `${Math.max(0, Math.max(...heights) - GAP)}px`;
  };

  const schedule = (grid: HTMLElement) => {
    const previous = state.get(grid);
    if (previous) cancelAnimationFrame(previous);
    state.set(grid, requestAnimationFrame(() => {
      state.delete(grid);
      layout(grid);
    }));
  };

  for (const grid of grids) {
    schedule(grid);
    grid.addEventListener('load', () => schedule(grid), true);
    window.addEventListener('resize', () => schedule(grid));

    const observer = new MutationObserver(() => schedule(grid));
    observer.observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }

  document.addEventListener('nsfwchange', () => {
    for (const grid of grids) schedule(grid);
  });

  document.fonts?.ready.then(() => {
    for (const grid of grids) schedule(grid);
  });
}

export {};
