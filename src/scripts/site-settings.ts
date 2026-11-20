const root = document.documentElement;
const trigger = document.querySelector<HTMLButtonElement>('[data-settings-open]');
const panel = document.querySelector<HTMLElement>('[data-settings-panel]');
const closeButton = document.querySelector<HTMLButtonElement>('[data-settings-close]');
const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');

const read = (key: string, fallback: string) => localStorage.getItem(`qwind-${key}`) || fallback;
const emit = (key: string, value: string) =>
  document.dispatchEvent(new CustomEvent('settingschange', { detail: { key, value } }));

const setResolvedTheme = (mode: string) => {
  const dark = mode === 'dark' || (mode === 'system' && darkQuery.matches);
  root.dataset.theme = dark ? 'dark' : 'light';
};

const push = (key: string, value: string) => {
  localStorage.setItem(`qwind-${key}`, value);
  emit(key, value);
};

const sync = () => {
  if (!panel) return;
  const theme = read('theme', 'system');
  const density = read('density', 'comfortable');

  for (const button of panel.querySelectorAll<HTMLButtonElement>('[data-setting="theme"]')) {
    button.setAttribute('aria-pressed', String(button.dataset.value === theme));
  }
  for (const button of panel.querySelectorAll<HTMLButtonElement>('[data-setting="density"]')) {
    button.setAttribute('aria-pressed', String(button.dataset.value === density));
  }

  const switches: Record<string, boolean> = {
    petals: root.dataset.petals !== 'off',
    motion: root.dataset.motion === 'reduced',
    toc: root.dataset.toc === 'open',
  };
  for (const [key, checked] of Object.entries(switches)) {
    panel.querySelector<HTMLElement>(`[data-setting="${key}"]`)?.setAttribute('aria-checked', String(checked));
  }

  const nsfw = panel.querySelector<HTMLElement>('[data-nsfw-toggle]');
  nsfw?.setAttribute('aria-pressed', String(root.dataset.nsfw === 'on'));
};

if (trigger && panel) {
  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector<HTMLButtonElement>('button')?.focus();
  };

  trigger.addEventListener('click', () => setOpen(panel.hidden));
  closeButton?.addEventListener('click', () => {
    setOpen(false);
    trigger.focus();
  });

  document.addEventListener('pointerdown', (event) => {
    if (panel.hidden) return;
    const target = event.target as Node;
    if (!panel.contains(target) && !trigger.contains(target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      trigger.focus();
    }
  });

  for (const button of panel.querySelectorAll<HTMLButtonElement>('[data-setting]')) {
    button.addEventListener('click', () => {
      const key = button.dataset.setting;
      if (!key) return;

      if (key === 'theme' || key === 'density') {
        const value = button.dataset.value ?? '';
        if (!value) return;
        if (key === 'theme') setResolvedTheme(value);
        else root.dataset.density = value;
        push(key, value);
      } else {
        const enabled = button.getAttribute('aria-checked') !== 'true';
        let value = '';
        if (key === 'petals') value = enabled ? 'on' : 'off';
        if (key === 'motion') value = enabled ? 'reduced' : 'full';
        if (key === 'toc') value = enabled ? 'open' : 'closed';
        if (!value) return;
        root.dataset[key] = value;
        push(key, value);
      }
      sync();
    });
  }

  document.addEventListener('nsfwchange', sync);
  sync();
}

// Quick theme toggle stays in sync with the detailed setting.
themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setResolvedTheme(next);
  push('theme', next);
  sync();
});

darkQuery.addEventListener('change', () => {
  if (read('theme', 'system') !== 'system') return;
  setResolvedTheme('system');
  emit('theme', 'system');
});

export {};
