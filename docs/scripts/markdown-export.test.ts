import { describe, expect, test } from 'bun:test';
import { convertPage } from './markdown-export';

describe('rendered documentation export', () => {
    test('preserves rendered prose, hidden tabs, definition lists, and normalized links', () => {
        const result = convertPage(`<title>Example · Legend</title><div data-doc-content><h2>Usage</h2>
            <p>Rendered component explanation.</p><div hidden><p>Alternate platform.</p></div>
            <dl><dt>speed</dt><dd>Motion speed.</dd></dl><a href="../api/">API</a>
            <div data-doc-exclude>Demo state</div><button>Copy</button></div>`, 'https://legend.so/slides/example/');
        expect(result.markdown).toContain('Rendered component explanation.');
        expect(result.markdown).toContain('Alternate platform.');
        expect(result.markdown).toContain('**speed**');
        expect(result.markdown).toContain('https://legend.so/slides/api/');
        expect(result.markdown).not.toContain('Demo state');
        expect(result.markdown).not.toContain('Copy');
    });

    test('preserves Shiki lines, indentation, language, and nested fences without editor duplication', () => {
        const result = convertPage(`<title>Code</title><div data-doc-content><p>A code example</p>
            <div data-doc-language="tsx"><pre><code><span class="line">const x = {</span><span class="line">  text: '~~~',</span><span class="line">};</span></code></pre></div>
            <div data-doc-exclude><pre>duplicate</pre></div>
            <pre data-language="md"><code>\`\`\`js\nconsole.log(1)\n\`\`\`</code></pre></div>`, 'https://legend.so/code/');
        expect(result.markdown).toContain("```tsx\nconst x = {\n  text: '~~~',\n};\n```");
        expect(result.markdown).toContain('````md\n```js\nconsole.log(1)\n```\n````');
        expect(result.codeBlocks).toHaveLength(2);
        expect(result.markdown).not.toContain('duplicate');
    });

    test('rejects absent or ambiguous content boundaries', () => {
        expect(() => convertPage('<main>Fallback</main>', 'https://legend.so/')).toThrow('content boundary');
        expect(() => convertPage('<div data-doc-content></div><div data-doc-content></div>', 'https://legend.so/')).toThrow('content boundary');
    });
});
