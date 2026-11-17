export const WORK_KINDS = ['painting', 'style', 'composition'] as const;
export type WorkKind = (typeof WORK_KINDS)[number];

export const WORK_TIERS = ['sketch', 'refined', 'showcase'] as const;
export type WorkTier = (typeof WORK_TIERS)[number];

export const TIER_LABELS: Record<WorkTier, string> = {
  sketch: '草稿',
  refined: '精修',
  showcase: '精选',
};

export const WORK_EXPERIMENTS = [
  'prompt',
  'lora',
  'sampler',
  'steps',
  'cfg',
  'upscale',
  'inpaint',
  'quantize',
] as const;
export type WorkExperiment = (typeof WORK_EXPERIMENTS)[number];

export const EXPERIMENT_LABELS: Record<WorkExperiment, string> = {
  prompt: '提示词测试',
  lora: 'LoRA 测试',
  sampler: '采样器对比',
  steps: '步数对比',
  cfg: 'CFG 对比',
  upscale: '放大对比',
  inpaint: '局部重绘',
  quantize: '量化对比',
};
