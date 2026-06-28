const site = import.meta.env.SITE.replace(/\/$/, '');
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const root = `${site}${base}`;

export function GET() {
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${root}/sitemap-index.xml`,
      ''
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    }
  );
}
