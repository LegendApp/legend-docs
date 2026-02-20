import type { Item as PageTreeItem, Node as PageTreeNode } from 'fumadocs-core/page-tree';

export function removeFilenameDatePrefix(slug: string): string {
    return slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

export function findOriginalBlogSlug(slug: string, pages: { slugs: string[] }[]): string {
    const pageWithPrefix = pages.find((p) => p.slugs[0].endsWith(`-${slug}`) || p.slugs[0] === slug);
    return pageWithPrefix?.slugs[0] ?? slug;
}

function removeDatePrefixFromUrl(url: string): string {
    if (!url.startsWith('/blog/')) {
        return url;
    }

    const parsedUrl = new URL(url, 'http://localhost');
    const segments = parsedUrl.pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return url;
    }

    const lastIndex = segments.length - 1;
    const sanitizedSegment = removeFilenameDatePrefix(segments[lastIndex]);

    if (sanitizedSegment === segments[lastIndex]) {
        return url;
    }

    segments[lastIndex] = sanitizedSegment;
    parsedUrl.pathname = `/${segments.join('/')}`;

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}

function sanitizeSidebarItem(item: PageTreeItem): PageTreeItem {
    const sanitizedUrl = removeDatePrefixFromUrl(item.url);
    return sanitizedUrl === item.url ? item : { ...item, url: sanitizedUrl };
}

function sanitizeSidebarNode(node: PageTreeNode): PageTreeNode {
    if (node.type === 'page') {
        return sanitizeSidebarItem(node);
    }

    if (node.type === 'folder') {
        const sanitizedIndex = node.index ? sanitizeSidebarItem(node.index) : undefined;

        return {
            ...node,
            ...(node.index ? { index: sanitizedIndex } : {}),
            children: node.children.map(sanitizeSidebarNode),
        };
    }

    return node;
}

export function sanitizeBlogPageTree<T extends { children: PageTreeNode[] }>(tree: T): T {
    return {
        ...tree,
        children: tree.children.slice().reverse().map(sanitizeSidebarNode),
    };
}
