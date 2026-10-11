import { expect, test } from 'bun:test';
import { documentationProjects, documentationRoutes, generatedDocumentationPaths } from './documentation-routes';
import { appHomepages } from '../src/lib/projects';
import { getAppHomepageRedirect } from '../src/lib/getDocsPath';

test('app homepages replace documentation and Markdown exports', () => {
    expect(appHomepages.map((app) => app.slug).sort()).toEqual(['chat-history', 'code', 'diff', 'hello-world', 'markdown', 'music', 'photos']);
    const routes = documentationRoutes();
    const generated = generatedDocumentationPaths();
    for (const app of appHomepages) {
        expect(documentationProjects).not.toContain(app);
        expect(routes.some(({ project }) => project.slug === app.slug)).toBe(false);
        expect([...generated].some((route) => route.startsWith(`${app.slug}/`) || route === `${app.slug}.md`)).toBe(false);
        expect(getAppHomepageRedirect(`/${app.slug}/availability/`)).toBe(`/${app.slug}/`);
        expect(getAppHomepageRedirect(`/${app.slug}/reference`)).toBe(`/${app.slug}/`);
        expect(getAppHomepageRedirect(`/${app.slug}/`)).toBeUndefined();
        expect(getAppHomepageRedirect(`/${app.slug}/reference/unknown`)).toBeUndefined();
    }
    expect(getAppHomepageRedirect('/spark/reference/')).toBeUndefined();
    expect(getAppHomepageRedirect('/unknown/availability/')).toBeUndefined();
});
