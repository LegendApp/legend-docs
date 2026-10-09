import fs from 'node:fs/promises';
import path from 'node:path';
import { OUTPUT, type ExportedPage } from './generate-llms';

const port = 3014;
const origin = `http://127.0.0.1:${port}`;
const server = Bun.spawn(['bun', 'x', 'wrangler', 'pages', 'dev', 'dist', '--ip', '127.0.0.1', '--port', String(port), '--compatibility-date', '2026-10-09', '--log-level', 'error'], {
    cwd: path.dirname(OUTPUT), stdout: 'ignore', stderr: 'pipe', env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
});
const errors = new Response(server.stderr).text();
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

try {
    let ready = false;
    for (let attempt = 0; attempt < 150; attempt++) {
        if (server.exitCode !== null) throw new Error(await errors);
        try { ready = (await fetch(`${origin}/llms.txt`)).ok; } catch { /* Wait for the local Pages runtime. */ }
        if (ready) break;
        await Bun.sleep(100);
    }
    assert(ready, 'Local Cloudflare Pages runtime did not become ready');
    const pages: ExportedPage[] = JSON.parse(await fs.readFile(path.join(OUTPUT, 'documentation-manifest.json'), 'utf8'));
    for (const page of pages) {
        const direct = await fetch(origin + new URL(page.markdownUrl).pathname);
        const negotiated = await fetch(origin + new URL(page.htmlUrl).pathname, { headers: { Accept: 'text/markdown' } });
        assert(direct.ok && negotiated.ok, `${page.htmlUrl}: failed Markdown request`);
        assert(direct.headers.get('Content-Type')?.startsWith('text/markdown') && negotiated.headers.get('Content-Type')?.startsWith('text/markdown'), `${page.htmlUrl}: wrong Markdown content type`);
        assert(negotiated.headers.get('Vary')?.includes('Accept') && negotiated.headers.get('Cache-Control')?.includes('no-store'), `${page.htmlUrl}: unsafe negotiated cache headers`);
        assert(await direct.text() === await negotiated.text(), `${page.htmlUrl}: direct and negotiated content differ`);
    }
    const url = `${origin}/slides/getting-started/`;
    for (const accept of ['text/html', 'text/markdown', 'text/html', 'text/markdown;q=0, */*', 'text/html, text/markdown;q=0.5']) {
        const response = await fetch(url, { headers: { Accept: accept } });
        assert(response.ok && response.headers.get('Content-Type')?.startsWith(accept === 'text/markdown' ? 'text/markdown' : 'text/html'), `Variant isolation failed for ${accept}`);
    }
    assert((await fetch(url, { method: 'HEAD', headers: { Accept: 'text/markdown' } })).headers.get('Content-Type')?.startsWith('text/markdown'), 'HEAD negotiation failed');
    assert((await fetch(`${origin}/missing-document.md`)).status === 404, 'Unknown Markdown route must be 404');
    assert((await fetch(`${origin}/api/search`)).ok, 'Search index must remain available');
    assert((await fetch(`${origin}/robots.txt`)).ok, 'Robots must remain available');
    console.log(`Cloudflare Pages runtime verified direct and negotiated Markdown for ${pages.length} pages, variant isolation, HEAD, 404, search, and robots.`);
} finally {
    server.kill('SIGTERM');
    await Promise.race([server.exited, Bun.sleep(2000)]);
    if (server.exitCode === null) { server.kill('SIGKILL'); await server.exited; }
}
