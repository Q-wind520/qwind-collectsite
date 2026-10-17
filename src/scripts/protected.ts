import { sha256Hex } from '../lib/protected';

const gate = document.querySelector<HTMLElement>('[data-protected-gate]');
const form = document.querySelector<HTMLFormElement>('[data-protected-form]');
const input = document.querySelector<HTMLInputElement>('[data-protected-input]');
const error = document.querySelector<HTMLElement>('[data-protected-error]');
const content = document.querySelector<HTMLElement>('[data-protected-content]');
const key = 'qwind-unlocked';

function showContent() {
  if (form) form.hidden = true;
  if (content) content.hidden = false;
}

if (gate && form && input && content) {
  if (sessionStorage.getItem(key) === '1') showContent();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const hash = await sha256Hex(input.value);
    if (hash === gate.dataset.hash) {
      sessionStorage.setItem(key, '1');
      showContent();
    } else if (error) {
      error.textContent = '密码不正确。';
    }
  });
}
