import path from 'node:path';
import { globSync } from 'glob';
import { projects } from '../src/lib/projects';

export const ROOT = path.resolve(import.meta.dirname, '..');
export const documentationProjects = projects;

export function documentationRoutes() {
    return documentationProjects.flatMap((project) =>
        globSync('**/*.mdx', { cwd: path.join(ROOT, 'content', project.slug) }).sort().map((entry) => {
            const slug = entry.replace(/\.mdx$/, '');
            const route = `${project.slug}/${slug}`.replace(/\/index$/, '');
            const version = project.category === 'library' ? slug.split('/')[0] : '';
            const prefix = [project.slug, version].filter(Boolean).join('/');
            const legacy = `${prefix}/llms/${version ? slug.split('/').slice(1).join('/') : slug}.md`;
            return { project, route, version, prefix, legacy, source: path.join(ROOT, 'content', project.slug, entry) };
        }));
}

export function generatedDocumentationPaths() {
    const paths = new Set(['llms.txt']);
    for (const project of documentationProjects) paths.add(`${project.slug}/llms.txt`);
    for (const { route, prefix, legacy } of documentationRoutes()) {
        paths.add(`${route}.md`);
        paths.add(`${route}/index.md`);
        paths.add(legacy);
        for (const file of ['llms.txt', 'llms.md', 'llms-full.txt', 'llms-full.md']) paths.add(`${prefix}/${file}`);
    }
    return paths;
}
