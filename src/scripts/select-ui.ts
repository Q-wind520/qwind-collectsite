const roots = [...document.querySelectorAll<HTMLElement>('[data-select]')];

for (const root of roots) {
  const select = root.querySelector<HTMLSelectElement>('select');
  const trigger = root.querySelector<HTMLButtonElement>('[data-select-trigger]');
  const label = root.querySelector<HTMLElement>('[data-select-label]');
  const menu = root.querySelector<HTMLElement>('[data-select-menu]');
  if (!select || !trigger || !label || !menu) continue;

  const items = [...menu.querySelectorAll<HTMLElement>('[role="option"]')];
  if (items.length === 0) continue;

  const sync = () => {
    const selected = select.selectedOptions[0];
    label.textContent = selected?.textContent ?? '';
    for (const item of items) {
      item.setAttribute('aria-selected', String(item.dataset.value === select.value));
    }
  };

  // Keep the visual trigger in sync when code assigns select.value directly.
  if (select.dataset.valuePatched !== 'true') {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (descriptor?.get && descriptor?.set) {
      const getValue = descriptor.get;
      const setValue = descriptor.set;
      Object.defineProperty(select, 'value', {
        configurable: true,
        enumerable: descriptor.enumerable,
        get() { return getValue.call(select); },
        set(next: string) { setValue.call(select, next); sync(); },
      });
      select.dataset.valuePatched = 'true';
    }
  }

  const close = (restoreFocus = false) => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
  };

  const open = () => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    root.classList.remove('align-end');

    requestAnimationFrame(() => {
      if (menu.getBoundingClientRect().right > window.innerWidth - 12) {
        root.classList.add('align-end');
      }
    });

    const current = items.findIndex((item) => item.dataset.value === select.value);
    const target = items[current >= 0 ? current : 0];
    target.focus();
    target.scrollIntoView({ block: 'nearest' });
  };

  const choose = (item: HTMLElement) => {
    select.value = item.dataset.value ?? '';
    sync();
    select.dispatchEvent(new Event('change', { bubbles: true }));
    close(true);
  };

  const move = (step: number) => {
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = index < 0 ? 0 : (index + step + items.length) % items.length;
    items[next].focus();
  };

  trigger.addEventListener('click', () => {
    if (menu.hidden) open();
    else close(true);
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    } else if (event.key === 'Escape' && !menu.hidden) {
      close(true);
    }
  });

  menu.addEventListener('click', (event) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (item) choose(item);
  });

  menu.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        items[0].focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(document.activeElement as HTMLElement);
        break;
      case 'Escape':
        event.preventDefault();
        close(true);
        break;
      case 'Tab':
        close();
        break;
    }
  });

  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget as Node | null)) close();
  });

  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target as Node)) close();
  });

  select.addEventListener('change', sync);
  select.closest('form')?.addEventListener('reset', () => window.setTimeout(sync, 0));

  sync();
}

export {};
