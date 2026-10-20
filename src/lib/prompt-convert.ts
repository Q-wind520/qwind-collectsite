export type PromptModelId = 'anima' | 'novelai';

export type PromptNode =
  | { type: 'text'; value: string }
  | { type: 'weight'; weight: number; children: PromptNode[]; source: PromptModelId };

export type ConversionResult = {
  output: string;
  warnings: string[];
};

export type ConversionRule = {
  from: string;
  to: string;
  note: string;
};

export type PromptConversion = {
  id: string;
  from: PromptModelId;
  to: PromptModelId;
  label: string;
  description: string;
  rules: ConversionRule[];
};

export const promptModels: Record<PromptModelId, { id: PromptModelId; label: string; note: string }> = {
  anima: {
    id: 'anima',
    label: 'Anima',
    note: 'A1111 风格权重 (tag:2)；官方建议权重大于 SDXL；画师用 @，标签用空格（score_* 除外）。',
  },
  novelai: {
    id: 'novelai',
    label: 'NovelAI V4.5',
    note: '{tag} ×1.05、[tag] ÷1.05；V4+ 数字权重 1.2::tag::；artist: 画师 tag。',
  },
};

const animaNovelAiRules: ConversionRule[] = [
  { from: '(tag:2)', to: '2::tag::', note: '数字权重，Anima 常用比 SDXL 更高的数值' },
  { from: '(tag)', to: '1.1::tag::', note: 'A1111 默认权重' },
  { from: '\\(tag\\)', to: '(tag)', note: '字面括号' },
  { from: '@artist name', to: 'artist:artist_name', note: '画师 tag，空格转下划线' },
  { from: '(rain, night:2)', to: '2::rain, night::', note: '多 tag 组合权重' },
];

const novelAiAnimaRules: ConversionRule[] = [
  { from: '1.2::tag::', to: '(tag:1.2)', note: '数字权重原样保留，不自动缩放' },
  { from: '{tag}', to: '(tag:1.05)', note: 'NovelAI 强调 ×1.05' },
  { from: '{{tag}}', to: '(tag:1.1025)', note: '嵌套强调，逐层 ×1.05' },
  { from: '[tag]', to: '(tag:0.9524)', note: 'NovelAI 弱化 ÷1.05' },
  { from: 'artist:artist_name', to: '@artist name', note: 'Anima 画师必须加 @，下划线转空格' },
  { from: '1.5::rain, night::', to: '(rain, night:1.5)', note: '多 tag 组合权重' },
];

export const promptConversions: PromptConversion[] = [
  {
    id: 'anima-to-novelai',
    from: 'anima',
    to: 'novelai',
    label: 'Anima → NovelAI V4.5',
    description: '把 A1111 风格权重和转义转换为 NovelAI 数字权重，@画师 转为 artist:。',
    rules: animaNovelAiRules,
  },
  {
    id: 'novelai-to-anima',
    from: 'novelai',
    to: 'anima',
    label: 'NovelAI V4.5 → Anima',
    description: '把 NovelAI 数字权重、括号权重和画师 tag 转换为 Anima 格式，数字权重原样保留。',
    rules: novelAiAnimaRules,
  },
];

export function convertPrompt(text: string, from: PromptModelId, to: PromptModelId): ConversionResult {
  const conversion = promptConversions.find((item) => item.from === from && item.to === to);
  if (!conversion) {
    return { output: text, warnings: ['暂不支持这个转换方向。'] };
  }

  if (from === 'novelai' && to === 'anima') return convertNovelAiToAnima(text);
  if (from === 'anima' && to === 'novelai') return convertAnimaToNovelAi(text);
  return { output: text, warnings: ['暂不支持这个转换方向。'] };
}

function convertNovelAiToAnima(text: string): ConversionResult {
  const parsed = parseNovelAi(text);
  return {
    output: renderAnima(parsed.nodes),
    warnings: parsed.warnings,
  };
}

function convertAnimaToNovelAi(text: string): ConversionResult {
  const parsed = parseAnima(text);
  return { output: renderNovelAi(parsed.nodes), warnings: parsed.warnings };
}

const NOVELAI_STRENGTHEN = 1.05;
const NOVELAI_WEAKEN = 1 / 1.05;
const NAI_NUMERIC_START = /^(-?\d+(?:\.\d+)?)::/;

function parseNovelAi(input: string): { nodes: PromptNode[]; warnings: string[] } {
  const warnings: string[] = [];
  let index = 0;

  const parseUntil = (stop?: '::' | '}' | ']'): PromptNode[] => {
    const nodes: PromptNode[] = [];
    let buffer = '';
    const flush = () => {
      if (buffer) {
        nodes.push({ type: 'text', value: buffer });
        buffer = '';
      }
    };

    while (index < input.length) {
      if (stop === '::' && input.startsWith('::', index)) break;
      if (stop === '}' && input[index] === '}') break;
      if (stop === ']' && input[index] === ']') break;

      const char = input[index];
      if (char === '{' || char === '[') {
        flush();
        const close = char === '{' ? '}' : ']';
        const weight = char === '{' ? NOVELAI_STRENGTHEN : NOVELAI_WEAKEN;
        index += 1;
        const children = parseUntil(close);
        if (input[index] === close) index += 1;
        else warnings.push(`未闭合的 ${char} 权重组`);
        nodes.push({ type: 'weight', weight, children, source: 'novelai' });
        continue;
      }

      const numeric = input.slice(index).match(NAI_NUMERIC_START);
      if (numeric) {
        flush();
        const weight = Number(numeric[1]);
        index += numeric[0].length;
        const children = parseUntil('::');
        if (input.startsWith('::', index)) index += 2;
        nodes.push({ type: 'weight', weight, children, source: 'novelai' });
        continue;
      }

      if (char === '}' || char === ']') {
        warnings.push(`多余的 ${char} 权重结束符`);
        buffer += char;
        index += 1;
        continue;
      }

      if (input.startsWith('::', index)) {
        warnings.push('多余的 :: 权重结束符');
        buffer += '::';
        index += 2;
        continue;
      }

      buffer += char;
      index += 1;
    }

    flush();
    return nodes;
  };

  return { nodes: parseUntil(), warnings };
}

function parseAnima(input: string): { nodes: PromptNode[]; warnings: string[] } {
  const warnings: string[] = [];
  let index = 0;

  const parseSequence = (): PromptNode[] => {
    const nodes: PromptNode[] = [];
    let buffer = '';
    const flush = () => {
      if (buffer) {
        nodes.push({ type: 'text', value: buffer });
        buffer = '';
      }
    };

    while (index < input.length) {
      const char = input[index];

      if (char === '\\' && (input[index + 1] === '(' || input[index + 1] === ')')) {
        buffer += input[index + 1];
        index += 2;
        continue;
      }

      if (char === '(') {
        flush();
        const start = index;
        index += 1;
        let depth = 1;
        while (index < input.length && depth > 0) {
          const inner = input[index];
          if (inner === '\\' && (input[index + 1] === '(' || input[index + 1] === ')')) {
            index += 2;
            continue;
          }
          if (inner === '(') depth += 1;
          else if (inner === ')') depth -= 1;
          index += 1;
        }

        const end = depth === 0 ? index - 1 : input.length;
        if (depth !== 0) warnings.push('未闭合的括号权重组');
        const raw = input.slice(start + 1, end);
        const { content, weight } = splitAnimaWeight(raw);
        const child = parseAnima(content);
        warnings.push(...child.warnings);
        nodes.push({
          type: 'weight',
          weight: weight ?? 1.1,
          children: child.nodes,
          source: 'anima',
        });
        continue;
      }

      if (char === ')') {
        warnings.push('多余的括号结束符');
        buffer += char;
        index += 1;
        continue;
      }

      buffer += char;
      index += 1;
    }

    flush();
    return nodes;
  };

  return { nodes: parseSequence(), warnings };
}

function splitAnimaWeight(raw: string): { content: string; weight?: number } {
  const match = raw.match(/:\s*([-+]?\d+(?:\.\d+)?)\s*$/);
  if (!match) return { content: raw };

  const colon = raw.lastIndexOf(':', match.index);
  let backslashes = 0;
  for (let i = colon - 1; i >= 0 && raw[i] === '\\'; i -= 1) backslashes += 1;
  if (backslashes % 2 === 1) return { content: raw };

  return {
    content: raw.slice(0, colon),
    weight: Number(match[1]),
  };
}

function renderAnima(nodes: PromptNode[]): string {
  let output = '';
  let previous: PromptNode | undefined;

  for (const node of nodes) {
    const part = node.type === 'text' ? novelAiTextToAnima(node.value) : renderAnimaWeight(node);
    if (!part) continue;
    if (needsSeparator(previous, node, output, part)) output += ', ';
    else if (output.endsWith(',') && !/^\s/.test(part)) output += ' ';
    output += part;
    previous = node;
  }

  return normalizeCommaSpacing(output);
}

function renderAnimaWeight(node: Extract<PromptNode, { type: 'weight' }>): string {
  if (node.children.length === 1 && node.children[0].type === 'weight') {
    const child = node.children[0];
    return renderAnimaWeight({
      type: 'weight',
      weight: node.weight * child.weight,
      children: child.children,
      source: node.source,
    });
  }

  let content = renderAnima(node.children).trim();
  content = content.replace(/^,+/, '').replace(/,+$/, '').trim();
  if (!content) return '';
  return `(${content}:${formatWeight(node.weight)})`;
}

function renderNovelAi(nodes: PromptNode[]): string {
  let output = '';
  let previous: PromptNode | undefined;

  for (const node of nodes) {
    const part = node.type === 'text' ? animaTextToNovelAi(node.value) : renderNovelAiWeight(node);
    if (!part) continue;
    if (needsSeparator(previous, node, output, part)) output += ', ';
    else if (output.endsWith(',') && !/^\s/.test(part)) output += ' ';
    output += part;
    previous = node;
  }

  return normalizeCommaSpacing(output);
}

function renderNovelAiWeight(node: Extract<PromptNode, { type: 'weight' }>): string {
  if (node.children.length === 1 && node.children[0].type === 'weight') {
    const child = node.children[0];
    return renderNovelAiWeight({
      type: 'weight',
      weight: node.weight * child.weight,
      children: child.children,
      source: node.source,
    });
  }

  let content = renderNovelAi(node.children).trim();
  content = content.replace(/^,+/, '').replace(/,+$/, '').trim();
  if (!content) return '';
  return `${formatWeight(node.weight)}::${content}::`;
}

function needsSeparator(previous: PromptNode | undefined, current: PromptNode, output: string, part: string): boolean {
  if (!previous) return false;
  if (previous.type !== 'weight' && current.type !== 'weight') return false;
  const leading = part.match(/^\s*/)?.[0] ?? '';
  if (leading.includes('\n') || leading.includes('\r')) return false;
  const first = part[leading.length];
  if (first === ',') return false;
  if (/[,\s]$/.test(output)) return false;
  return true;
}

function novelAiTextToAnima(value: string): string {
  return value
    .replace(/\bartist:([^,\n]+)/g, (_match, name: string) => `@${name.trim().replace(/_/g, ' ')}`)
    .replace(/([()])/g, '\\$1')
    .replace(/([^\s,]),(?=[^\s,])/g, '$1, ')
    .replace(/\b(score_\d+)\b|_/g, (_match, score?: string) => score ?? ' ');
}

function animaTextToNovelAi(value: string): string {
  const withoutEscapes = value.replace(/\\([()])/g, '$1');
  return withoutEscapes
    .replace(/@([^,\n]+?)(?=,|\n|$)/g, (_match, name: string) => `artist:${name.trim().replace(/\s+/g, '_')}`)
    .replace(/([^\s,]),(?=[^\s,])/g, '$1, ');
}

function formatWeight(weight: number): string {
  return String(Number(weight.toFixed(4)));
}

function normalizeCommaSpacing(value: string): string {
  return value.replace(/([^\s,]),(?=[^\s,])/g, '$1, ');
}
