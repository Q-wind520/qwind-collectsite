export type WorkSummary = {
  slug: string;
  title: string;
  artists: string[];
  tags: string[];
  rating: string;
  date: string;
  protected: boolean;
};

export type GalleryFilter = {
  artist?: string;
  rating?: string;
  tag?: string;
  sort?: 'newest' | 'oldest' | 'random';
};

export function filterWorks(works: WorkSummary[], filter: GalleryFilter): WorkSummary[] {
  let result = works.filter((work) => !work.protected);

  if (filter.artist) result = result.filter((work) => work.artists.includes(filter.artist!));
  if (filter.rating) result = result.filter((work) => work.rating === filter.rating);
  if (filter.tag) result = result.filter((work) => work.tags.includes(filter.tag!));

  if (filter.sort === 'oldest') {
    return [...result].sort((a, b) => a.date.localeCompare(b.date));
  }
  if (filter.sort === 'random') {
    return shuffle([...result]);
  }
  return [...result].sort((a, b) => b.date.localeCompare(a.date));
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
