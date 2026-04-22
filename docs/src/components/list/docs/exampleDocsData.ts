import type { ExampleMeta, ExampleSlug } from '@/components/list/examples-shared/catalog';
import { CURATED_EXAMPLES, CURATED_GROUP_ORDER } from '@/components/list/examples-shared/catalog';

export type ExampleVariant = 'default' | 'playground';
export type ExampleFeature = {
    description: string;
    name: string;
};

export type ExampleDocsEntry = ExampleMeta & {
    featuresUsed: ExampleFeature[];
    githubUrl: string;
    sourcePath: string;
    sourceUsesWindowScroll?: boolean;
    variant?: ExampleVariant;
    windowScroll?: boolean;
};

const sourcePaths: Record<ExampleSlug, string> = {
    'activity-history': 'example-web/src/examples/curated/ActivityHistoryExample.tsx',
    'ai-chat': 'example-web/src/examples/curated/AiChatExample.tsx',
    'cards-feed': 'example-web/src/examples/curated/CardsFeedExample.tsx',
    'chat': 'example-web/src/examples/curated/ChatExample.tsx',
    'directory': 'example-web/src/examples/curated/DirectoryExample.tsx',
    'gallery-grid': 'example-web/src/examples/curated/GalleryGridExample.tsx',
    'infinite-calendar': 'example-web/src/examples/curated/InfiniteCalendarExample.tsx',
    'media-rails': 'example-web/src/examples/curated/MediaRailsExample.tsx',
    'notifications-inbox': 'example-web/src/examples/curated/NotificationsInboxExample.tsx',
    'product-shelf': 'example-web/src/examples/curated/ProductShelfExample.tsx',
    'sectioned-directory': 'example-web/src/examples/curated/SectionedDirectoryExample.tsx',
    'video-feed': 'example-web/src/examples/curated/VideoFeedExample.tsx',
};

const featuresUsedBySlug: Record<ExampleSlug, ExampleFeature[]> = {
    'activity-history': [
        {
            description: 'to keep the live timeline pinned to the latest activity until the user scrolls away.',
            name: 'maintainScrollAtEnd',
        },
        {
            description: 'to preserve the current viewport when older activity is prepended above it.',
            name: 'maintainVisibleContentPosition',
        },
        {
            description: 'to fetch older activity when scrolling back in time.',
            name: 'onStartReached',
        },
        {
            description: 'to pin day separators while the timeline moves through mixed live and historical rows.',
            name: 'stickyHeaderIndices',
        },
    ],
    'ai-chat': [
        {
            description: 'to open the conversation at the latest message.',
            name: 'initialScrollAtEnd',
        },
        {
            description: 'to reserve space around the streaming reply so the anchored bottom edge does not jump as it grows.',
            name: 'anchoredEndSpace',
        },
        {
            description: 'to jump the list to the placeholder reply that streaming will update.',
            name: 'scrollToIndex',
        },
    ],
    'cards-feed': [
        {
            description: 'so the list uses the page scroll position instead of an internal scroller.',
            name: 'useWindowScroll',
        },
        {
            description: 'to preserve poll selections, likes, and expansion state while interactive cards recycle.',
            name: 'useRecyclingState',
        },
        {
            description: 'to opt specific row-local state into recycling-aware storage for mixed interactive card types.',
            name: 'extraData.recycleState',
        },
    ],
    'chat': [
        {
            description: 'to follow new messages near the bottom.',
            name: 'maintainScrollAtEnd',
        },
        {
            description: 'to keep prepend loads from jumping the viewport.',
            name: 'maintainVisibleContentPosition',
        },
        {
            description: 'to tune how aggressively the list keeps following the newest message.',
            name: 'maintainScrollAtEndThreshold',
        },
        {
            description: 'to fetch older messages.',
            name: 'onStartReached',
        },
        {
            description: 'for sticky day separators.',
            name: 'stickyHeaderIndices',
        },
        {
            description: 'so short conversations stay docked to the bottom.',
            name: 'alignItemsAtEnd',
        },
    ],
    'directory': [
        {
            description: 'to swap the visible dataset immediately as the query changes without rebuilding the surrounding list shell.',
            name: 'live filtering',
        },
    ],
    'gallery-grid': [
        {
            description: 'to reflow the same dataset across a live-changing number of columns.',
            name: 'numColumns',
        },
    ],
    'infinite-calendar': [
        {
            description: 'to switch the same month data between vertical scrolling and paged horizontal mode.',
            name: 'horizontal',
        },
        {
            description: 'to keep the current month anchored while older and newer months are inserted around it.',
            name: 'maintainVisibleContentPosition',
        },
        {
            description: 'to grow the month range infinitely in both directions.',
            name: 'onStartReached / onEndReached',
        },
        {
            description: 'to recenter the active month after mode switches and month navigation.',
            name: 'scrollToIndex',
        },
    ],
    'media-rails': [
        {
            description: 'to compose a vertical feed whose rows each contain their own independently scrolling rail.',
            name: 'nested LegendList',
        },
        {
            description: 'so each poster rail scrolls sideways inside the outer vertical list.',
            name: 'horizontal',
        },
    ],
    'notifications-inbox': [
        {
            description: 'for prepend-heavy inbox updates.',
            name: 'maintainVisibleContentPosition',
        },
        {
            description: 'to mark notifications read when they are actually seen in the viewport.',
            name: 'onViewableItemsChanged',
        },
        {
            description: 'to define what "seen" means before unread rows flip to read.',
            name: 'viewabilityConfig',
        },
    ],
    'product-shelf': [
        {
            description: 'to reflow the shelf between different column counts.',
            name: 'numColumns',
        },
        {
            description: 'to let section headers span the full row while products stay in the grid.',
            name: 'overrideItemLayout',
        },
        {
            description: 'to size headers differently from product cards during initial layout.',
            name: 'getEstimatedItemSize',
        },
        {
            description: 'to keep section headers pinned while the mixed grid scrolls.',
            name: 'stickyHeaderIndices',
        },
    ],
    'sectioned-directory': [
        {
            description: 'for grouped section headers.',
            name: 'stickyHeaderIndices',
        },
    ],
    'video-feed': [
        {
            description: 'to append more clips as the viewer approaches the end of the feed.',
            name: 'onEndReached',
        },
    ],
};

const variantBySlug: Partial<Record<ExampleSlug, ExampleVariant>> = {
    chat: 'playground',
};

const windowScrollBySlug: Partial<Record<ExampleSlug, boolean>> = {
    'cards-feed': false,
};

const sourceUsesWindowScrollBySlug: Partial<Record<ExampleSlug, boolean>> = {
    'cards-feed': true,
};

export const LIST_EXAMPLE_DOCS: ExampleDocsEntry[] = CURATED_EXAMPLES.map((example) => ({
    ...example,
    featuresUsed: featuresUsedBySlug[example.slug],
    githubUrl: `https://github.com/LegendApp/legend-list/blob/main/${sourcePaths[example.slug]}`,
    sourcePath: sourcePaths[example.slug],
    sourceUsesWindowScroll: sourceUsesWindowScrollBySlug[example.slug] ?? false,
    variant: variantBySlug[example.slug] ?? 'default',
    windowScroll: windowScrollBySlug[example.slug] ?? false,
}));

export const LIST_EXAMPLE_DOCS_BY_SLUG = Object.fromEntries(
    LIST_EXAMPLE_DOCS.map((example) => [example.slug, example]),
) as Record<ExampleSlug, ExampleDocsEntry>;

export const LIST_EXAMPLE_GROUPS = CURATED_GROUP_ORDER.map((group) => ({
    examples: LIST_EXAMPLE_DOCS.filter((example) => example.group === group),
    group,
}));
