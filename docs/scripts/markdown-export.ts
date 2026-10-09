import { load } from 'cheerio';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

export function convertPage(html: string, canonical: string) {
    const $ = load(html);
    const body = $('[data-doc-content]');
    if (body.length !== 1) throw new Error(`${canonical}: expected one documentation content boundary`);
    const title = $('title').text().replace(/\s*·\s*Legend$/, '').trim();
    const description = $('meta[name="description"]').attr('content') ?? '';
    body.find('[data-doc-exclude], script, style, svg, button, input, select, nav').remove();
    body.find('h1').each((_, node) => { $(node).replaceWith($('<h2>').html($(node).html() ?? '')); });
    body.find('a[href], img[src], video[src]').each((_, node) => {
        const attribute = node.tagName === 'a' ? 'href' : 'src';
        const value = $(node).attr(attribute);
        if (value) $(node).attr(attribute, new URL(value, canonical).href);
    });

    const codeBlocks: { language: string; code: string }[] = [];
    body.find('pre').each((_, node) => {
        const pre = $(node);
        const code = pre.find('code').first();
        const lines = code.children('.line');
        const text = lines.length ? lines.toArray().map((line) => $(line).text()).join('\n') : (code.length ? code : pre).text();
        const language = pre.closest('[data-language]').attr('data-language') ?? pre.closest('[data-doc-language]').attr('data-doc-language') ??
            code.attr('class')?.match(/language-([\w+-]+)/)?.[1] ?? '';
        codeBlocks.push({ language, code: text });
        pre.attr('data-export-code', String(codeBlocks.length - 1));
    });

    const converter = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
    converter.use(gfm);
    converter.addRule('code', {
        filter: 'pre',
        replacement: (_, node) => {
            const { language, code } = codeBlocks[Number(node.getAttribute('data-export-code'))];
            const longest = Math.max(0, ...Array.from(code.matchAll(/`+/g), (match) => match[0].length));
            const fence = '`'.repeat(Math.max(3, longest + 1));
            return `\n\n${fence}${language}\n${code}${code.endsWith('\n') ? '' : '\n'}${fence}\n\n`;
        },
    });
    converter.addRule('definitionTerm', { filter: 'dt', replacement: (content) => `\n\n**${content}**\n\n` });
    converter.addRule('definition', { filter: 'dd', replacement: (content) => `${content}\n\n` });
    converter.addRule('video', {
        filter: 'video',
        replacement: (_, node) => `\n\n[${node.getAttribute('aria-label') ?? 'Video'}](${node.getAttribute('src')})\n\n`,
    });
    const content = converter.turndown(body.html() ?? '').trim();
    if (!title || content.length < 20) throw new Error(`${canonical}: empty documentation export`);
    return { title, description, codeBlocks, markdown: `# ${title}\n\n${description ? `${description}\n\n` : ''}Source: ${canonical}\n\n${content}\n` };
}
