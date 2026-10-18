const KEY = 'qwind-nsfw';
const root = document.documentElement;
const toggle = document.querySelector<HTMLButtonElement>('[data-nsfw-toggle]');
const label = document.querySelector<HTMLElement>('[data-nsfw-label]');
const dialog = document.querySelector<HTMLDialogElement>('[data-nsfw-dialog]');
const stepText = document.querySelector<HTMLElement>('[data-nsfw-step-text]');
const stepCount = document.querySelector<HTMLElement>('[data-nsfw-step-count]');
const next = document.querySelector<HTMLButtonElement>('[data-nsfw-next]');
const cancel = document.querySelector<HTMLButtonElement>('[data-nsfw-cancel]');

const steps = [
  {
    text: '本内容包含成人向作品。确认你已年满 18 岁，并愿意继续查看。',
    action: '我已满 18 岁',
  },
  {
    text: '再次确认：你所在地区允许查看此类内容，且这是你自愿的选择。',
    action: '继续确认',
  },
  {
    text: '最后确认：开启后 NSFW 作品会显示在画廊、首页和搜索中。',
    action: '确认开启',
  },
];

let step = 0;

const isOn = () => root.dataset.nsfw === 'on';

function sync() {
  const on = isOn();
  toggle?.setAttribute('aria-pressed', String(on));
  toggle?.setAttribute('aria-label', on ? '关闭 NSFW 内容' : '显示 NSFW 内容');
  if (label) label.textContent = on ? 'NSFW ON' : 'NSFW';
}

function setOn(on: boolean) {
  root.dataset.nsfw = on ? 'on' : 'off';
  localStorage.setItem(KEY, on ? 'on' : 'off');
  sync();
  document.dispatchEvent(new CustomEvent('nsfwchange', { detail: { on } }));
}

function renderStep() {
  const current = steps[step];
  if (!current) return;
  if (stepText) stepText.textContent = current.text;
  if (stepCount) stepCount.textContent = `${step + 1} / ${steps.length}`;
  if (next) next.textContent = current.action;
}

function openDialog() {
  if (!dialog) return;
  step = 0;
  renderStep();
  dialog.showModal();
}

toggle?.addEventListener('click', () => {
  if (isOn()) setOn(false);
  else openDialog();
});

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-nsfw-enable]')) {
  button.addEventListener('click', openDialog);
}

next?.addEventListener('click', () => {
  if (step < steps.length - 1) {
    step += 1;
    renderStep();
    return;
  }
  setOn(true);
  dialog?.close();
});

cancel?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

sync();
