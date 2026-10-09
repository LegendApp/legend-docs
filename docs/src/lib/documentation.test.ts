import { expect, test } from 'bun:test';
import { documentationSchema, documentContext, documentationMetadata, serializeStructuredData } from './documentation';

test('separates current and archived documentation without implying npm stability', () => {
    expect(documentContext('/state/v2/usage/observable/').archived).toBe(true);
    expect(documentContext('/state/v3/usage/observable/').archived).toBe(false);
    expect(documentContext('/spark/getting-started/').project?.status).toContain('Experimental');
    expect(documentationMetadata({ title: 'Guide', url: '/slides/getting-started/' }).alternates?.types)
        .toEqual({ 'text/markdown': '/slides/getting-started.md' });
});

test('structured data reflects the actual document, hierarchy, and version', () => {
    const graph = documentationSchema({ title: 'API', description: 'Read observables.', url: '/state/v2/react/react-api/' })["@graph"];
    expect(graph[0]).toMatchObject({ '@type': 'TechArticle', headline: 'API', version: 'v2', url: 'https://legend.so/state/v2/react/react-api/' });
    expect(graph[0]).not.toHaveProperty('dateModified');
    expect(graph[1]).toMatchObject({ '@type': 'BreadcrumbList' });
    expect(documentationSchema({ title: 'Slides', url: '/slides/' })['@graph'][0]['@type']).toBe('WebPage');
});

test('frontmatter cannot close a structured data script element', () => {
    const value = { title: '</script><script>alert(1)</script>' };
    const encoded = serializeStructuredData(value);
    expect(encoded).not.toContain('<');
    expect(JSON.parse(encoded)).toEqual(value);
});
