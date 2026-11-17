export type WorkFilterState = {
  artist: string;
  rating: string;
  tags: string[];
  tier: string;
  experiment: string;
};

export type WorkFilterData = {
  nsfw: boolean;
  artists: string[];
  rating: string;
  tags: string[];
  tier: string;
  experiments: string[];
};

export function matchesWorkFilter(data: WorkFilterData, filter: WorkFilterState, nsfwOn: boolean): boolean {
  if (data.nsfw && !nsfwOn) return false;
  if (filter.artist && !data.artists.includes(filter.artist)) return false;
  if (filter.rating && data.rating !== filter.rating) return false;
  if (filter.tags.length > 0 && !filter.tags.some((tag) => data.tags.includes(tag))) return false;
  if (filter.tier && data.tier !== filter.tier) return false;
  if (filter.experiment && !data.experiments.includes(filter.experiment)) return false;
  return true;
}
