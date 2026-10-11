import { expect, test } from 'bun:test';
import worker, { prefersMarkdown } from './worker';
import { appHomepages } from '../src/lib/projects';

test('old app subpages permanently redirect to marketing homepages', async () => {
    const env = { ASSETS: { async fetch() { throw new Error('Redirects must not fetch assets'); } } };
    for (const app of appHomepages) {
        for (const page of ['availability', 'reference']) {
            for (const slash of ['', '/']) {
                const response = await worker.fetch(new Request(`https://legend.so/${app.slug}/${page}${slash}?from=old`, { headers: { Accept: 'text/markdown' } }), env);
                expect(response.status).toBe(308);
                expect(response.headers.get('Location')).toBe(`https://legend.so/${app.slug}/?from=old`);
            }
        }
    }
});

test('negotiation requires an explicit, acceptable Markdown preference', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true);
    expect(prefersMarkdown('text/markdown;q=0, */*')).toBe(false);
    expect(prefersMarkdown('text/html, text/markdown;q=0.5')).toBe(false);
    expect(prefersMarkdown('text/html;q=0.5, TEXT/MARKDOWN;q=1')).toBe(true);
    expect(prefersMarkdown('text/markdown;q=invalid')).toBe(false);
    expect(prefersMarkdown('*/*')).toBe(false);
});

test('keeps HTML and Markdown separate, follows version redirects, and preserves HEAD', async () => {
    const requests: Request[] = [];
    const env = { ASSETS: { async fetch(request: Request) {
        requests.push(request);
        const markdown = new URL(request.url).pathname.endsWith('.md');
        return new Response(request.method === 'HEAD' ? null : markdown ? '# Documentation' : '<html>Documentation</html>', {
            headers: { 'Content-Type': markdown ? 'application/octet-stream' : 'text/html', 'Vary': 'Accept-Encoding' },
        });
    } } };
    const html = await worker.fetch(new Request('https://legend.so/slides/'), env);
    expect(html.headers.get('Content-Type')).toBe('text/html');
    expect(html.headers.get('Vary')).toBe('Accept-Encoding, Accept');
    const markdown = await worker.fetch(new Request('https://legend.so/state/v2/?test=1', { headers: { Accept: 'text/markdown' } }), env);
    expect(requests.at(-1)?.url).toBe('https://legend.so/state/v2/intro/introduction.md?test=1');
    expect(markdown.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(markdown.headers.get('Cache-Control')).toBe('private, no-store');
    const head = await worker.fetch(new Request('https://legend.so/slides/', { method: 'HEAD', headers: { Accept: 'text/markdown' } }), env);
    expect(head.body).toBeNull();
    expect(requests.at(-1)?.method).toBe('HEAD');
});

test('missing Markdown falls back to HTML and unknown direct URLs remain 404', async () => {
    const env = { ASSETS: { async fetch(request: Request) {
        return new URL(request.url).pathname.endsWith('.md') ? new Response('Not found', { status: 404 }) : new Response('<html>Home</html>', { headers: { 'Content-Type': 'text/html' } });
    } } };
    const fallback = await worker.fetch(new Request('https://legend.so/', { headers: { Accept: 'text/markdown' } }), env);
    expect(fallback.status).toBe(200);
    expect(fallback.headers.get('Content-Type')).toBe('text/html');
    const missing = await worker.fetch(new Request('https://legend.so/missing.md'), env);
    expect(missing.status).toBe(404);
    expect(missing.headers.get('Content-Type') ?? '').not.toContain('text/markdown');
});
