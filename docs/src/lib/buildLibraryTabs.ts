import { getVersionTabUrls } from '@/lib/getVersionTabUrls';
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled, TbHexagonNumber3Filled } from 'react-icons/tb';
import { createElement, type ReactNode } from 'react';

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

type LibraryVersionConfig = {
    stableVersion: number;
    betaVersion?: number;
};

const versionIconByNumber: Record<number, () => ReactNode> = {
    1: () => createElement(TbHexagonNumber1Filled, { size: 20 }),
    2: () => createElement(TbHexagonNumber2Filled, { size: 20 }),
    3: () => createElement(TbHexagonNumber3Filled, { size: 20 }),
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isPageNode = (node: unknown): node is PageNodeLike => {
    return isObject(node) && node.type === 'page' && typeof node.url === 'string';
};

const isFolderNode = (node: unknown): node is FolderNodeLike => {
    return isObject(node) && node.type === 'folder' && Array.isArray(node.children);
};

const normalizePath = (path: string): string => {
    const trimmed = path.trim();
    if (!trimmed || trimmed === '/') return '/';
    const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return withLeadingSlash.replace(/\/+$/, '');
};

function collectUrls(nodes: unknown[], urls: string[], seen: Set<string>) {
    for (const node of nodes) {
        if (isPageNode(node)) {
            if (!node.external) {
                const normalized = normalizePath(node.url);
                if (!seen.has(normalized)) {
                    seen.add(normalized);
                    urls.push(normalized);
                }
            }
            continue;
        }

        if (isFolderNode(node)) {
            if (node.index?.url) {
                const normalized = normalizePath(node.index.url);
                if (!seen.has(normalized)) {
                    seen.add(normalized);
                    urls.push(normalized);
                }
            }
            collectUrls(node.children, urls, seen);
        }
    }
}

function getAllUrls(pageTree: PageTreeLike): string[] {
    const urls: string[] = [];
    collectUrls(pageTree.children, urls, new Set<string>());
    return urls;
}

function parseVersion(url: string, libraryBase: string): number | null {
    const match = url.match(new RegExp(`^/${libraryBase}/v(\\d+)(?:/|$)`));
    if (!match) return null;
    const parsed = Number.parseInt(match[1], 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function getFirstDocsPathForVersion(pageTree: PageTreeLike, libraryBase: string, version: number): string {
    const versionPrefix = `/${libraryBase}/v${version}`;
    const firstPath = getAllUrls(pageTree).find((url) => url === versionPrefix || url.startsWith(`${versionPrefix}/`));
    return firstPath ?? versionPrefix;
}

function getVersionDescription(version: number, stableVersion: number, betaVersion?: number): string {
    if (betaVersion === version) return 'Beta version';
    if (stableVersion === version) return 'Current stable version';
    if (version < stableVersion) return 'Legacy version';
    return 'Preview version';
}

export function buildLibraryTabs(pageTree: PageTreeLike, libraryBase: string, config: LibraryVersionConfig) {
    const stableVersion = config.stableVersion;
    const betaVersion = config.betaVersion;
    const versions = new Set<number>();

    for (const url of getAllUrls(pageTree)) {
        const parsedVersion = parseVersion(url, libraryBase);
        if (parsedVersion !== null) {
            versions.add(parsedVersion);
        }
    }

    versions.add(stableVersion);
    if (typeof betaVersion === 'number') {
        versions.add(betaVersion);
    }

    const orderedVersions = [...versions].sort((a, b) => a - b);

    return orderedVersions.map((version) => {
        const url = getFirstDocsPathForVersion(pageTree, libraryBase, version);
        return {
            title: `Version ${version}`,
            description: getVersionDescription(version, stableVersion, betaVersion),
            url,
            urls: getVersionTabUrls(pageTree, url),
            icon: versionIconByNumber[version]?.(),
        };
    });
}

export type { LibraryVersionConfig };
