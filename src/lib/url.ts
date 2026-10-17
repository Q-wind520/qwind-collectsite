export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const joined = `${cleanBase}${cleanPath}`;
  return joined === '' ? '/' : joined;
}

export function assetUrl(src: string, base = import.meta.env.BASE_URL): string {
  if (/^https?:\/\//.test(src)) return src;
  const cleanBase = base.replace(/\/+$/, '');
  if (cleanBase && (src === cleanBase || src.startsWith(`${cleanBase}/`))) return src;
  return withBase(src, base);
}
