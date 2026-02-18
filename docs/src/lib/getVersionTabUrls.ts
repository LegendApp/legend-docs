type PageTreeLike = {
    children: unknown[];
};

type PageNodeLike = {
    type: 'page';
    external?: boolean;
    url: string;
};

type FolderNodeLike = {
    type: 'folder';
    children: unknown[];
    index?: {
        url: string;
    };
};

const isObject = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
};

const isPageNode = (node: unknown): node is PageNodeLike => {
    return isObject(node) && node.type === 'page' && typeof node.url === 'string';
};

const isFolderNode = (node: unknown): node is FolderNodeLike => {
    return isObject(node) && node.type === 'folder' && Array.isArray(node.children);
};

const normalizePath = (path: string): string => {
    const trimmedPath = path.trim();
    if (!trimmedPath || trimmedPath === '/') {
        return '/';
    }

    const withLeadingSlash = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
    return withLeadingSlash.replace(/\/+$/, '');
};

const getVersionPrefix = (path: string): string => {
    const normalizedPath = normalizePath(path);
    const segments = normalizedPath.split('/').filter(Boolean);

    if (segments.length < 2) {
        return normalizedPath;
    }

    return `/${segments[0]}/${segments[1]}`;
};

const collectUrls = (nodes: unknown[], urls: Set<string>) => {
    for (const node of nodes) {
        if (isPageNode(node)) {
            if (!node.external) {
                urls.add(normalizePath(node.url));
            }
            continue;
        }

        if (isFolderNode(node)) {
            if (node.index?.url) {
                urls.add(normalizePath(node.index.url));
            }
            collectUrls(node.children, urls);
        }
    }
};

export function getVersionTabUrls(pageTree: PageTreeLike, tabUrl: string): Set<string> {
    const versionPrefix = getVersionPrefix(tabUrl);
    const allUrls = new Set<string>();
    collectUrls(pageTree.children, allUrls);

    const versionUrls = new Set<string>(
        [...allUrls].filter((url) => {
            return url === versionPrefix || url.startsWith(`${versionPrefix}/`);
        }),
    );

    if (versionUrls.size === 0) {
        versionUrls.add(normalizePath(tabUrl));
    }

    return versionUrls;
}
