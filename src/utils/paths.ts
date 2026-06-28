export function withBase(path = '/') {
  if (!path || path === '/') {
    return import.meta.env.BASE_URL || '/';
  }

  if (/^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i.test(path)) {
    return path;
  }

  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const cleanPath = pathname.replace(/^\/+/, '');

  return `${base}${cleanPath}${suffix}`;
}
