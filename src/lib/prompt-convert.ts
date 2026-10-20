export type PromptModelId = 'anima' | 'novelai' | 'novelai-v5';

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
    note: '{tag} ×1.05、[tag] ÷1.05；V4+ 数字权重 1.2::tag::；画师名按本站习惯用下划线。',
  },
  'novelai-v5': {
    id: 'novelai-v5',
    label: 'NovelAI V5',
    note: '权重语法与 V4.5 相同；V5 对空格与大小写更敏感，画师名用空格，并支持自然语言与多语言。',
  },
};

const animaNovelAiRules: ConversionRule[] = [
  { from: '(tag:2)', to: '2::tag::', note: '数字权重，Anima 常用比 SDXL 更高的数值' },
  { from: '(tag)', to: '1.1::tag::', note: 'A1111 默认权重' },
  { from: '\\(tag\\)', to: '(tag)', note: '字面括号' },
  { from: '@artist name', to: 'artist:artist_name', note: 'V4.5 画师 tag，本站习惯用下划线' },
  { from: '(rain, night:2)', to: '2::rain, night::', note: '多 tag 组合权重' },
];

const animaNovelAiV5Rules: ConversionRule[] = [
  { from: '(tag:2)', to: '2::tag::', note: '数字权重，Anima 常用比 SDXL 更高的数值' },
  { from: '(tag)', to: '1.1::tag::', note: 'A1111 默认权重' },
  { from: '\\(tag\\)', to: '(tag)', note: '字面括号' },
  { from: '@artist name', to: 'artist:artist name', note: 'V5 画师 tag 用空格，不用下划线' },
  { from: 'long_hair', to: 'long hair', note: 'V5 对空格更敏感，下划线会被当作字面字符' },
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

const novelAiV5AnimaRules: ConversionRule[] = [
  ...novelAiAnimaRules.slice(0, 4),
  { from: 'artist:artist name', to: '@artist name', note: 'Anima 画师必须加 @，空格原样保留' },
  { from: '1.5::rain, night::', to: '(rain, night:1.5)', note: '多 tag 组合权重' },
  { from: 'long_hair', to: 'long hair', note: '下划线转为空格，score_* 除外' },
];

const novelAiToV5Rules: ConversionRule[] = [
  { from: 'long_hair', to: 'long hair', note: 'V5 把下划线当字面字符，tag 内改用空格' },
  { from: 'artist:foo_bar', to: 'artist:foo bar', note: 'V5 画师名用空格' },
  { from: 'year_2023', to: 'year 2023', note: '年份等多词 tag 同样改为空格' },
  { from: 'score_7', to: 'score_7', note: 'score_* 保留原样' },
  { from: '1.2::tag::', to: '1.2::tag::', note: '权重语法相同，但 V5 的响应通常更强' },
  { from: '{{tag}}', to: '{{tag}}', note: '括号权重语法相同；V5 更依赖词序' },
];

const v5ToNovelAiRules: ConversionRule[] = [
  { from: 'artist:foo bar', to: 'artist:foo_bar', note: '转回 V4.5 时画师名改用下划线' },
  { from: 'long hair', to: 'long hair', note: '普通多词 tag 保持空格' },
  { from: 'depthness', to: 'depthness', note: 'V5 专属 tag 会保留，但 V4.5 可能无效' },
  { from: '日本語 / 中文', to: 'English', note: 'V4.5 的 T5 分词器不支持大多数 Unicode 字符' },
  { from: '1.2::tag::', to: '1.2::tag::', note: '权重语法相同；V4.5 与 V5 效果不同，需手动微调' },
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
  {
    id: 'anima-to-novelai-v5',
    from: 'anima',
    to: 'novelai-v5',
    label: 'Anima → NovelAI V5',
    description: '把 A1111 权重转换为 V5 数字权重；画师名与下划线统一改为空格，score_* 除外。',
    rules: animaNovelAiV5Rules,
  },
  {
    id: 'novelai-v5-to-anima',
    from: 'novelai-v5',
    to: 'anima',
    label: 'NovelAI V5 → Anima',
    description: '把 V5 数字权重、括号权重和画师 tag 转换为 Anima 格式；V5 专属 tag 会保留并提示。',
    rules: novelAiV5AnimaRules,
  },
  {
    id: 'novelai-to-novelai-v5',
    from: 'novelai',
    to: 'novelai-v5',
    label: 'NovelAI V4.5 → NovelAI V5',
    description: '统一空格与画师名写法，适配 V5 更敏感的分词器；权重数值不做缩放。',
    rules: novelAiToV5Rules,
  },
  {
    id: 'novelai-v5-to-novelai',
    from: 'novelai-v5',
    to: 'novelai',
    label: 'NovelAI V5 → NovelAI V4.5',
    description: '把画师名改回下划线写法，并检查 V5 专属 tag 与 V4.5 不支持的 Unicode 字符。',
    rules: v5ToNovelAiRules,
  },
];

const isNovelAi = (model: PromptModelId): model is 'novelai' | 'novelai-v5' => model.startsWith('novelai');

export function convertPrompt(text: string, from: PromptModelId, to: PromptModelId): ConversionResult {
  const conversion = promptConversions.find((item) => item.from === from && item.to === to);
  if (!conversion) {
    return { output: text, warnings: ['暂不支持这个转换方向。'] };
  }

  if (isNovelAi(from) && to === 'anima') return convertNovelAiToAnima(text);
  if (from === 'anima' && isNovelAi(to)) return convertAnimaToNovelAi(text, to);
  if (from === 'novelai' && to === 'novelai-v5') return convertNovelAiVersions(text, 'v5');
  if (from === 'novelai-v5' && to === 'novelai') return convertNovelAiVersions(text, 'v4-5');
  return { output: text, warnings: ['暂不支持这个转换方向。'] };
}

function convertNovelAiToAnima(text: string): ConversionResult {
  const parsed = parseNovelAi(text);
  const warnings = [...parsed.warnings];
  if (/[^\x00-\x7F]/.test(text)) {
    warnings.push('提示词中的非英文字符在 Anima 中可能无法识别，建议改用英文 tag。');
  }
  return {
    output: renderAnima(parsed.nodes),
    warnings,
  };
}

function convertAnimaToNovelAi(text: string, target: 'novelai' | 'novelai-v5'): ConversionResult {
  const parsed = parseAnima(text);
  const warnings = [...parsed.warnings];
  const output = renderNovelAi(parsed.nodes, (value) => animaTextToNovelAi(value, target));
  if (target === 'novelai-v5' && hasUnderscoreTags(text)) {
    warnings.push('已把下划线 tag 转为空格；V5 对空格与大小写更敏感。');
  }
  return { output, warnings };
}

function convertNovelAiVersions(text: string, target: 'v5' | 'v4-5'): ConversionResult {
  const parsed = parseNovelAi(text);
  const warnings = [...parsed.warnings];
  let transformed = text;

  if (target === 'v5') {
    transformed = text.replace(/\b(score_\d+)\b|_/g, (_match, score?: string) => score ?? ' ');
    transformed = transformed.replace(/artist:([^,\n]+)/g, (_match, name: string) => `artist:${name.replace(/_/g, ' ')}`);
    if (hasUnderscoreTags(text)) {
      warnings.push('已把 V4.5 的下划线 tag 转为空格，并统一画师名写法。');
    }
  } else {
    transformed = text.replace(/artist:([^,\n]+)/g, (_match, name: string) => `artist:${name.trim().replace(/\s+/g, '_')}`);
    const unicode = text.match(/[^\x00-\x7F]+/g);
    if (unicode) warnings.push('V4.5 的 T5 分词器不支持大多数 Unicode 字符（如日文/中文），请改用英文。');
    const v5Only = findV5OnlyTags(text);
    if (v5Only.length > 0) warnings.push(`V5 专属 tag 在 V4.5 中可能无效：${v5Only.join('、')}。`);
  }

  const reparsed = parseNovelAi(transformed);
  return {
    output: renderNovelAi(reparsed.nodes, (value) => normalizeNovelAiText(value, target === 'v5' ? 'spaces' : 'artist-underscores')),
    warnings: [...warnings, ...reparsed.warnings],
  };
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

function renderNovelAi(nodes: PromptNode[], transform: (value: string) => string): string {
  let output = '';
  let previous: PromptNode | undefined;

  for (const node of nodes) {
    const part = node.type === 'text' ? transform(node.value) : renderNovelAiWeight(node, transform);
    if (!part) continue;
    if (needsSeparator(previous, node, output, part)) output += ', ';
    else if (output.endsWith(',') && !/^\s/.test(part)) output += ' ';
    output += part;
    previous = node;
  }

  return normalizeCommaSpacing(output);
}

function renderNovelAiWeight(node: Extract<PromptNode, { type: 'weight' }>, transform: (value: string) => string): string {
  if (node.children.length === 1 && node.children[0].type === 'weight') {
    const child = node.children[0];
    return renderNovelAiWeight({
      type: 'weight',
      weight: node.weight * child.weight,
      children: child.children,
      source: node.source,
    }, transform);
  }

  let content = renderNovelAi(node.children, transform).trim();
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

function animaTextToNovelAi(value: string, target: 'novelai' | 'novelai-v5'): string {
  const withoutEscapes = value.replace(/\\([()])/g, '$1');
  const withArtists = withoutEscapes.replace(/@([^,\n]+?)(?=,|\n|$)/g, (_match, name: string) => {
    const artist = name.trim();
    return `artist:${target === 'novelai-v5' ? artist : artist.replace(/\s+/g, '_')}`;
  });
  const normalized = target === 'novelai-v5' ? replaceLegacyUnderscores(withArtists) : withArtists;
  return normalizeCommaSpacing(normalized);
}

function normalizeNovelAiText(value: string, mode: 'spaces' | 'artist-underscores'): string {
  if (mode === 'spaces') {
    return normalizeCommaSpacing(replaceLegacyUnderscores(value));
  }
  const withArtistUnderscores = value.replace(/artist:([^,\n]+)/g, (_match, name: string) =>
    `artist:${name.trim().replace(/\s+/g, '_')}`);
  return normalizeCommaSpacing(withArtistUnderscores);
}

function replaceLegacyUnderscores(value: string): string {
  return value.replace(/\b(score_\d+)\b|_/g, (_match, score?: string) => score ?? ' ');
}

function hasUnderscoreTags(value: string): boolean {
  return replaceLegacyUnderscores(value) !== value;
}

const V5_ONLY_TAGS = [
  'depthness',
  'attractive male',
  'low complexity',
  'medium complexity',
  'high complexity',
  'ultra complexity',
  'has alpha',
  'alpha transparency',
  'meta:novel era',
  'meta:golden era',
  'visual novel art',
  'visual novel bg',
  'visual novel cg',
  'visual novel chibi',
  'visual novel sprite',
];

function findV5OnlyTags(value: string): string[] {
  const lower = value.toLowerCase();
  return V5_ONLY_TAGS.filter((tag) => lower.includes(tag));
}

function formatWeight(weight: number): string {
  return String(Number(weight.toFixed(4)));
}

function normalizeCommaSpacing(value: string): string {
  return value.replace(/([^\s,]),(?=[^\s,])/g, '$1, ');
}
