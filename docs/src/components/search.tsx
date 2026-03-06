'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import {
    SearchDialog,
    SearchDialogClose,
    SearchDialogContent,
    SearchDialogHeader,
    SearchDialogIcon,
    SearchDialogInput,
    SearchDialogList,
    SearchDialogListItem,
    SearchDialogOverlay,
    type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import type { HighlightedText } from 'fumadocs-core/search/server';
import type { SortedResult } from 'fumadocs-core/search/server';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { FileText, Hash } from 'lucide-react';

const iconByType: Record<SortedResult['type'], ReactNode> = {
    page: (
        <FileText className="size-6 shrink-0 rounded-sm border bg-fd-muted p-0.5 text-fd-muted-foreground shadow-sm" />
    ),
    heading: <Hash className="size-4 shrink-0 text-fd-muted-foreground" />,
    text: null,
};

function renderHighlights(nodes: HighlightedText[]): ReactNode {
    return nodes.map((node, index) => {
        if (node.styles?.highlight) {
            return (
                <span key={index} className="bg-fd-primary/10 text-fd-primary">
                    {node.content}
                </span>
            );
        }

        return <span key={index}>{node.content}</span>;
    });
}

function stripMarkdownSyntax(text: string) {
    return text
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '')
        .replace(/^\s{0,3}>+\s?/gm, '')
        .replace(/^\s{0,3}#{1,6}\s+/gm, '')
        .replace(/<\/?[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function renderHighlightedMarkdown(content: string): ReactNode {
    const parts = content.split(/(<mark>.*?<\/mark>)/gi);
    const nodes: ReactNode[] = [];

    for (const [index, part] of parts.entries()) {
        if (!part) continue;

        const match = part.match(/^<mark>([\s\S]*?)<\/mark>$/i);
        const text = stripMarkdownSyntax(match ? match[1] : part);

        if (!text) continue;

        nodes.push(
            match ? (
                <span key={index} className="bg-fd-primary/10 text-fd-primary">
                    {text}
                </span>
            ) : (
                <span key={index}>{text}</span>
            ),
        );
    }

    return nodes;
}

function formatPath(url: string) {
    const [path, hash] = url.split('#');
    const cleanPath = decodeURI(path).replace(/^\//, '');

    if (hash) {
        return `${cleanPath} › ${decodeURI(hash)}`;
    }

    return cleanPath;
}

function normalizePath(path: string, basePath: string) {
    const [withoutHash] = path.split('#');
    let cleaned = decodeURI(withoutHash);

    if (basePath && cleaned.startsWith(basePath)) {
        cleaned = cleaned.slice(basePath.length);
    }

    if (!cleaned.startsWith('/')) {
        cleaned = `/${cleaned}`;
    }

    if (cleaned.length > 1 && cleaned.endsWith('/')) {
        cleaned = cleaned.slice(0, -1);
    }

    return cleaned;
}

function getLibraryScope(path: string): string | null {
    if (path === '/list' || path.startsWith('/list/')) return '/list';
    if (path === '/state' || path.startsWith('/state/')) return '/state';
    if (path === '/motion' || path.startsWith('/motion/')) return '/motion';

    return null;
}

function getVersionScope(path: string): string | null {
    const segments = path.split('/').filter(Boolean);

    if (segments.length < 2) {
        return null;
    }

    if (!/^v\d+$/.test(segments[1])) {
        return null;
    }

    return `/${segments[0]}/${segments[1]}`;
}

function SearchResultItem({ item, onClick }: { item: SortedResult; onClick: () => void }) {
    const pathLabel = formatPath(item.url);

    return (
        <SearchDialogListItem item={item} onClick={onClick} className="flex-col items-start gap-1">
            <div className="flex w-full items-start gap-2">
                {item.type !== 'text' ? (
                    iconByType[item.type]
                ) : (
                    <div className="mt-1 h-4 w-1 rounded-sm bg-fd-muted-foreground/40" />
                )}
                <p className="min-w-0 flex-1 truncate font-medium text-fd-popover-foreground">
                    {item.contentWithHighlights
                        ? renderHighlights(item.contentWithHighlights)
                        : renderHighlightedMarkdown(item.content)}
                </p>
            </div>
            <div className="w-full text-xs text-fd-muted-foreground/80">{pathLabel}</div>
        </SearchDialogListItem>
    );
}

export default function StaticSearchDialog(props: SharedProps) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const searchEndpoint = `${basePath}/api/search`;
    const pathname = usePathname();

    const { search, setSearch, query } = useDocsSearch({
        type: 'static',
        from: searchEndpoint,
    });

    const filteredResults = useMemo(() => {
        if (!Array.isArray(query.data)) {
            return [];
        }

        if (!pathname) {
            return query.data;
        }

        const currentPath = normalizePath(pathname, basePath);
        const scope = getVersionScope(currentPath) ?? getLibraryScope(currentPath);

        if (!scope) {
            return query.data;
        }

        return query.data.filter((item) => {
            const itemPath = normalizePath(item.url, basePath);
            return itemPath === scope || itemPath.startsWith(`${scope}/`);
        });
    }, [query.data, pathname, basePath]);

    return (
        <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
            <SearchDialogOverlay />
            <SearchDialogContent className="mt-10 bg-fd-popover/50 backdrop-blur-md md:mt-0">
                <SearchDialogHeader>
                    <SearchDialogIcon />
                    <SearchDialogInput />
                    <SearchDialogClose />
                </SearchDialogHeader>
                <SearchDialogList
                    items={filteredResults.length > 0 ? filteredResults : null}
                    Item={({ item, onClick }) => <SearchResultItem item={item as SortedResult} onClick={onClick} />}
                />
            </SearchDialogContent>
        </SearchDialog>
    );
}
