import { getAppHomepageRedirect, getDocumentationRedirect } from '../src/lib/getDocsPath';

type Assets = { fetch(request: Request): Promise<Response> };

export function prefersMarkdown(accept: string) {
    const types = accept.toLowerCase().split(',').map((part) => {
        const [type, ...parameters] = part.trim().split(';');
        const quality = parameters.find((parameter) => parameter.trim().startsWith('q='));
        const value = quality ? Number(quality.trim().slice(2)) : 1;
        return { type: type.trim(), quality: Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0 };
    });
    const markdown = types.find(({ type }) => type === 'text/markdown')?.quality ?? 0;
    const html = (types.find(({ type }) => type === 'text/html') ?? types.find(({ type }) => type === 'text/*') ?? types.find(({ type }) => type === '*/*'))?.quality ?? 0;
    return markdown > 0 && markdown >= html;
}

function responseWithHeaders(response: Response, markdown: boolean, negotiated: boolean) {
    const headers = new Headers(response.headers);
    if (markdown) headers.set('Content-Type', 'text/markdown; charset=utf-8');
    if (negotiated) {
        const vary = new Set((headers.get('Vary') ?? '').split(',').map((value) => value.trim()).filter(Boolean));
        vary.add('Accept');
        headers.set('Vary', [...vary].join(', '));
        headers.set('Cache-Control', 'private, no-store');
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
    async fetch(request: Request, env: { ASSETS: Assets }) {
        if (!['GET', 'HEAD'].includes(request.method)) return env.ASSETS.fetch(request);
        const url = new URL(request.url);
        const redirect = getAppHomepageRedirect(url.pathname);
        if (redirect) return Response.redirect(new URL(redirect + url.search, url), 308);
        if (url.pathname.endsWith('.md')) {
            const response = await env.ASSETS.fetch(request);
            return responseWithHeaders(response, response.ok || response.status === 304, false);
        }
        const route = url.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
        if (prefersMarkdown(request.headers.get('Accept') ?? '') && !route.split('/').pop()?.includes('.')) {
            const target = new URL(url);
            target.pathname = `${getDocumentationRedirect(route) ?? route}.md`;
            const response = await env.ASSETS.fetch(new Request(target, request));
            if (response.ok && !response.headers.get('Content-Type')?.includes('text/html')) {
                return responseWithHeaders(response, true, true);
            }
        }
        const response = await env.ASSETS.fetch(request);
        return responseWithHeaders(response, false, response.headers.get('Content-Type')?.includes('text/html') ?? false);
    },
};
