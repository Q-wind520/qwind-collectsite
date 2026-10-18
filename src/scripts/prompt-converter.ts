import { convertPrompt, promptModels, type PromptModelId } from '../lib/prompt-convert';

const root = document.querySelector<HTMLElement>('[data-prompt-converter]');
if (root) {
  const sourceSelect = root.querySelector<HTMLSelectElement>('[data-source-select]');
  const targetSelect = root.querySelector<HTMLSelectElement>('[data-target-select]');
  const source = root.querySelector<HTMLTextAreaElement>('[data-source]');
  const output = root.querySelector<HTMLTextAreaElement>('[data-output]');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const convertButton = root.querySelector<HTMLButtonElement>('[data-convert]');
  const swapButton = root.querySelector<HTMLButtonElement>('[data-swap]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-copy]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-clear]');
  const sampleButton = root.querySelector<HTMLButtonElement>('[data-load-sample]');

  const models = Object.keys(promptModels) as PromptModelId[];
  const samples: Record<PromptModelId, string> = {
    anima: '(@konya_karasue:0.73), (masterpiece:1.5), 1girl, plana \\(blue archive\\), beach, (best quality:1.05)',
    novelai: '0.73::artist:konya_karasue::, 1.5::masterpiece::, 1girl, plana (blue archive), beach, {best quality}',
  };

  const setStatus = (message: string, warning = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('warn', warning);
  };

  const ensureDistinct = (changed: 'source' | 'target') => {
    if (!sourceSelect || !targetSelect || sourceSelect.value !== targetSelect.value) return;
    const other = models.find((model) => model !== sourceSelect.value);
    if (!other) return;
    if (changed === 'source') targetSelect.value = other;
    else sourceSelect.value = other;
  };

  const convert = () => {
    if (!source || !output || !sourceSelect || !targetSelect) return;
    const text = source.value;
    if (!text.trim()) {
      output.value = '';
      setStatus('请输入提示词后再转换。', true);
      return;
    }
    const result = convertPrompt(text, sourceSelect.value as PromptModelId, targetSelect.value as PromptModelId);
    output.value = result.output;
    if (result.warnings.length > 0) setStatus(result.warnings.join(' '), true);
    else setStatus(`已转换为 ${promptModels[targetSelect.value as PromptModelId].label}。`);
  };

  sourceSelect?.addEventListener('change', () => {
    ensureDistinct('source');
    if (source?.value.trim()) convert();
  });
  targetSelect?.addEventListener('change', () => {
    ensureDistinct('target');
    if (source?.value.trim()) convert();
  });

  convertButton?.addEventListener('click', convert);
  swapButton?.addEventListener('click', () => {
    if (!sourceSelect || !targetSelect || !source || !output) return;
    const from = sourceSelect.value as PromptModelId;
    const to = targetSelect.value as PromptModelId;
    const previousOutput = output.value;
    sourceSelect.value = to;
    targetSelect.value = from;
    if (previousOutput.trim()) source.value = previousOutput;
    convert();
  });
  copyButton?.addEventListener('click', async () => {
    if (!output?.value.trim()) {
      setStatus('当前没有可复制的结果。', true);
      return;
    }
    try {
      await navigator.clipboard.writeText(output.value);
      setStatus('已复制到剪贴板。');
    } catch {
      output.select();
      document.execCommand('copy');
      setStatus('已复制到剪贴板。');
    }
  });
  clearButton?.addEventListener('click', () => {
    if (source) source.value = '';
    if (output) output.value = '';
    setStatus('选择模型后输入提示词，点击转换。');
    source?.focus();
  });
  sampleButton?.addEventListener('click', () => {
    if (!source || !sourceSelect) return;
    source.value = samples[sourceSelect.value as PromptModelId] ?? samples.anima;
    convert();
    source.focus();
  });
}
