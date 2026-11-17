import { describe, expect, it } from 'vitest';
import {
  EXPERIMENT_LABELS,
  TIER_LABELS,
  WORK_EXPERIMENTS,
  WORK_KINDS,
  WORK_TIERS,
} from '../../src/lib/work-meta';

describe('work metadata vocabulary', () => {
  it('labels every tier', () => {
    expect(WORK_TIERS).toEqual(['sketch', 'refined', 'showcase']);
    expect(WORK_TIERS.map((tier) => TIER_LABELS[tier])).toEqual(['草稿', '精修', '精选']);
  });

  it('labels every experiment type', () => {
    expect(WORK_EXPERIMENTS).toEqual([
      'prompt', 'lora', 'sampler', 'steps', 'cfg', 'upscale', 'inpaint', 'quantize',
    ]);
    expect(WORK_EXPERIMENTS.map((experiment) => EXPERIMENT_LABELS[experiment])).toEqual([
      '提示词测试', 'LoRA 测试', '采样器对比', '步数对比', 'CFG 对比', '放大对比', '局部重绘', '量化对比',
    ]);
  });

  it('keeps the prompt kinds', () => {
    expect(WORK_KINDS).toEqual(['painting', 'style', 'composition']);
  });
});
