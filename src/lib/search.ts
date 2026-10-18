export type SearchEntry = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  url: string;
  text: string;
  date: string;
  nsfw?: boolean;
};

export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function bigrams(text: string): string[] {
  const compact = normalize(text).replace(/[^\p{L}\p{N}]+/gu, '');
  const result = new Set<string>();
  for (let index = 0; index < compact.length - 1; index += 1) {
    result.add(compact.slice(index, index + 2));
  }
  return [...result];
}

export function searchEntries(entries: SearchEntry[], query: string, limit = 20): SearchEntry[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const queryBigrams = bigrams(normalizedQuery);
  const minBigrams = Math.min(2, queryBigrams.length);

  return entries
    .map((entry) => {
      const title = normalize(entry.title);
      const summary = normalize(entry.summary);
      const tags = normalize(entry.tags.join(' '));
      const text = normalize(entry.text);
      let score = 0;
      let matchedBigrams = 0;

      const exact = title.includes(normalizedQuery)
        || tags.includes(normalizedQuery)
        || summary.includes(normalizedQuery)
        || text.includes(normalizedQuery);

      if (title.includes(normalizedQuery)) score += 12;
      if (tags.includes(normalizedQuery)) score += 8;
      if (summary.includes(normalizedQuery)) score += 4;
      if (text.includes(normalizedQuery)) score += 2;

      for (const bigram of queryBigrams) {
        let matched = false;
        if (title.includes(bigram)) { score += 4; matched = true; }
        if (tags.includes(bigram)) { score += 3; matched = true; }
        if (summary.includes(bigram)) { score += 2; matched = true; }
        if (text.includes(bigram)) { score += 1; matched = true; }
        if (matched) matchedBigrams += 1;
      }

      if (!exact && matchedBigrams < minBigrams) return { entry, score: 0 };
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
    .slice(0, limit)
    .map(({ entry }) => entry);
}
