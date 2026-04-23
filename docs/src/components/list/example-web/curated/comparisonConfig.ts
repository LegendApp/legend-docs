export type ComparisonLibraryId = 'legend-list' | 'virtua' | 'react-virtuoso' | 'react-window' | 'tanstack-virtual';

export type ComparisonLibrarySelection = ComparisonLibraryId | 'all';

export type ComparisonLibraryRuntimeConfig = {
    drawDistance?: number;
    increaseViewportBy?: {
        bottom: number;
        top: number;
    };
    overscan?: number;
    overscanCount?: number;
};

export type ComparisonLibraryMeta = {
    description: string;
    id: ComparisonLibraryId;
    label: string;
    runtime: ComparisonLibraryRuntimeConfig;
};

export type ComparisonSearchState = {
    count: number;
    extraNodes: number;
    librarySelection: ComparisonLibrarySelection;
    workMs: number;
};

const DefaultCount = 5000;
const DefaultExtraNodes = 0;
const DefaultWorkMs = 2;
const DefaultLibrarySelection: ComparisonLibrarySelection = 'all';

export const COMPARISON_VIEWPORT_HEIGHT = 640;
export const COMPARISON_ESTIMATED_ROW_HEIGHT = 140;
export const COMPARISON_PRELOAD_PX = 500;
export const COMPARISON_OVERSCAN_COUNT = Math.max(
    1,
    Math.ceil(COMPARISON_PRELOAD_PX / COMPARISON_ESTIMATED_ROW_HEIGHT),
);

export const DEFAULT_COMPARISON_STATE: ComparisonSearchState = {
    count: DefaultCount,
    extraNodes: DefaultExtraNodes,
    librarySelection: DefaultLibrarySelection,
    workMs: DefaultWorkMs,
};

export const COMPARISON_LIBRARIES: readonly ComparisonLibraryMeta[] = [
    {
        description: "Legend List running through the package's web entrypoint.",
        id: 'legend-list',
        label: 'LegendList',
        runtime: {
            drawDistance: COMPARISON_PRELOAD_PX,
        },
    },
    {
        description: 'virtua VList with lazy row rendering.',
        id: 'virtua',
        label: 'virtua',
        runtime: {
            overscan: COMPARISON_OVERSCAN_COUNT,
        },
    },
    {
        description: 'react-virtuoso with variable-height itemContent.',
        id: 'react-virtuoso',
        label: 'react-virtuoso',
        runtime: {
            increaseViewportBy: {
                bottom: COMPARISON_PRELOAD_PX,
                top: COMPARISON_PRELOAD_PX,
            },
        },
    },
    {
        description: 'react-window List using dynamic row heights.',
        id: 'react-window',
        label: 'react-window',
        runtime: {
            overscanCount: COMPARISON_OVERSCAN_COUNT,
        },
    },
    {
        description: 'TanStack Virtual backed by a custom scroll container.',
        id: 'tanstack-virtual',
        label: 'TanStack Virtual',
        runtime: {
            overscan: COMPARISON_OVERSCAN_COUNT,
        },
    },
] as const;

export function getComparisonLibraryRuntimeConfig(libraryId: ComparisonLibraryId) {
    return COMPARISON_LIBRARIES.find((library) => library.id === libraryId)!.runtime;
}

export function getVisibleComparisonLibraryIds(selection: ComparisonLibrarySelection): ComparisonLibraryId[] {
    return selection === 'all' ? COMPARISON_LIBRARIES.map((library) => library.id) : [selection];
}
