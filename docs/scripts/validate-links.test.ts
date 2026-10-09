import { describe, expect, test } from 'bun:test';
import LinkValidator from './validate-links';

describe('documentation links', () => {
    const validator = new LinkValidator();

    test('ignores example assets while keeping real links and source line numbers', () => {
        const content = [
            '[Before](/slides)',
            '```md',
            '![Example](./images/photo.png)',
            '```',
            '[After](/slides/components)',
        ].join('\n');
        expect(validator.extractRelativeLinks(content, 'guide.mdx').map(({ url, line }) => ({ url, line })))
            .toEqual([{ url: '/slides', line: 1 }, { url: '/slides/components', line: 5 }]);
    });

    test('keeps shorter and mismatched fences inside the example', () => {
        const content = [
            '````md',
            '```',
            '[Example](./missing.mdx)',
            '~~~',
            '````',
            '[Real](/slides/layouts)',
        ].join('\n');
        expect(validator.extractRelativeLinks(content, 'guide.mdx').map(({ url }) => url))
            .toEqual(['/slides/layouts']);
    });

    test('supports indented tilde fences and an unclosed example', () => {
        const content = [
            '   ~~~md',
            '[Example](./missing.mdx)',
            '   ~~~~',
            '[Real](/slides/transitions)',
            '```md',
            '[Unclosed example](./missing.mdx)',
        ].join('\n');
        expect(validator.extractRelativeLinks(content, 'guide.mdx').map(({ url }) => url))
            .toEqual(['/slides/transitions']);
    });
});
