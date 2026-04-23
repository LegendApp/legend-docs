import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';

import { LegendList } from '@legendapp/list/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VList } from 'virtua';

import {
    COMPARISON_LIBRARIES,
    type ComparisonLibraryId,
    type ComparisonSearchState,
    DEFAULT_COMPARISON_STATE,
    getComparisonLibraryRuntimeConfig,
    getVisibleComparisonLibraryIds,
} from './comparisonConfig';
import { Shell } from './shared';

type DemoItem = {
    description: string;
    id: string;
    title: string;
};

type ComparisonPanelProps = {
    data: DemoItem[];
    extraNodes: number;
    workMs: number;
};

const ItemCardSpacing = 6;
const ReactWindowEstimatedSize = 140;
const PanelShellClassName = 'h-[35rem] w-full min-w-0';

const generateData = (count: number): DemoItem[] =>
    Array.from({ length: count }, (_, index) => ({
        description: `This is the description for item ${index + 1}. It has some text to make it variable height. ${
            index % 3 === 0
                ? 'This item has extra content to demonstrate variable heights in the virtualized list.'
                : ''
        }`,
        id: `item-${index}`,
        title: `Item ${index + 1}`,
    }));

function doBusyWorkMs(milliseconds: number, seed: number) {
    if (!milliseconds) {
        return seed;
    }

    const start = performance.now();
    let accumulator = seed;

    while (performance.now() - start < milliseconds) {
        accumulator += Math.sqrt(accumulator + 0.0001) % 1.001;
        if (accumulator > 1e6) {
            accumulator %= 97;
        }
    }

    return accumulator;
}

const ItemCard: React.FC<{
    extraNodes: number;
    index: number;
    item: DemoItem;
    useMargin?: boolean;
    workMs: number;
}> = ({ extraNodes, index, item, useMargin = true, workMs }) => {
    doBusyWorkMs(workMs, index + 1);
    const nodes = Array.from({ length: extraNodes });

    return (
        <div
            className={`min-h-16 rounded-lg border border-zinc-800 p-3 ${
                index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-950'
            } ${useMargin ? 'mb-1.5' : ''}`}
        >
            <div className="mb-1 text-sm font-semibold text-zinc-100">{item.title}</div>
            <div className={`text-xs leading-5 text-zinc-400 ${nodes.length ? 'mb-1.5' : ''}`}>{item.description}</div>
            {nodes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {nodes.map((_, nodeIndex) => (
                        <span
                            className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-[10px] text-zinc-300"
                            key={nodeIndex}
                        >
                            tag-{(index + nodeIndex) % 100}
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

const Panel: React.FC<{
    children: React.ReactNode;
    title: string;
}> = ({ children, title }) => (
    <div
        className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.25)] ${PanelShellClassName}`}
    >
        <div className="border-b border-zinc-800 bg-zinc-900 px-3 py-2">
            <div className="text-xs font-semibold text-zinc-100">{title}</div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-2">{children}</div>
    </div>
);

type ReactWindowRowData = {
    data: DemoItem[];
    extraNodes: number;
    workMs: number;
};

type ReactWindowRowProps = RowComponentProps<ReactWindowRowData>;

function ReactWindowRow({ ariaAttributes, data, extraNodes, index, style, workMs }: ReactWindowRowProps) {
    const item = data[index];

    return (
        <div
            {...ariaAttributes}
            style={{
                ...style,
                boxSizing: 'border-box',
                paddingBottom: ItemCardSpacing,
            }}
        >
            <ItemCard extraNodes={extraNodes} index={index} item={item} useMargin={false} workMs={workMs} />
        </div>
    );
}

function LegendListPanel({ data, extraNodes, workMs }: ComparisonPanelProps) {
    const runtime = getComparisonLibraryRuntimeConfig('legend-list');

    return (
        <Panel title="LegendList">
            <LegendList
                className="h-full min-h-0"
                data={data}
                drawDistance={runtime.drawDistance}
                extraData={{ example: 'comparison' }}
                keyExtractor={(item: DemoItem) => item.id}
                recycleItems
                renderItem={({ item, index }: { index: number; item: DemoItem }) => (
                    <ItemCard extraNodes={extraNodes} index={index} item={item} workMs={workMs} />
                )}
            />
        </Panel>
    );
}

function VirtuaPanel({ data, extraNodes, workMs }: ComparisonPanelProps) {
    const runtime = getComparisonLibraryRuntimeConfig('virtua');

    return (
        <Panel title="virtua">
            <VList count={data.length} overscan={runtime.overscan} style={{ height: '100%' }}>
                {(index) => <ItemCard extraNodes={extraNodes} index={index} item={data[index]} workMs={workMs} />}
            </VList>
        </Panel>
    );
}

function VirtuosoPanel({ data, extraNodes, workMs }: ComparisonPanelProps) {
    const runtime = getComparisonLibraryRuntimeConfig('react-virtuoso');

    return (
        <Panel title="react-virtuoso">
            <Virtuoso
                data={data}
                increaseViewportBy={runtime.increaseViewportBy}
                itemContent={(index, item) => (
                    <ItemCard extraNodes={extraNodes} index={index} item={item as DemoItem} workMs={workMs} />
                )}
                style={{ height: '100%' }}
            />
        </Panel>
    );
}

function ReactWindowPanel({ data, extraNodes, workMs }: ComparisonPanelProps) {
    const runtime = getComparisonLibraryRuntimeConfig('react-window');
    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: ReactWindowEstimatedSize,
        key: `${data.length}-${extraNodes}`,
    });

    return (
        <Panel title="react-window">
            <List
                overscanCount={runtime.overscanCount}
                rowComponent={ReactWindowRow}
                rowCount={data.length}
                rowHeight={rowHeight}
                rowProps={{ data, extraNodes, workMs }}
                style={{ height: '100%' }}
            />
        </Panel>
    );
}

function TanStackVirtualPanel({ data, extraNodes, workMs }: ComparisonPanelProps) {
    const parentRef = React.useRef<HTMLDivElement | null>(null);
    const runtime = getComparisonLibraryRuntimeConfig('tanstack-virtual');
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        estimateSize: () => 100,
        getScrollElement: () => parentRef.current,
        overscan: runtime.overscan,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
        <Panel title="TanStack Virtual">
            <div
                className="relative min-h-0 flex-1 overflow-auto"
                ref={parentRef}
                style={{ contain: 'size layout paint', height: '100%' }}
            >
                <div className="relative w-full" style={{ height: rowVirtualizer.getTotalSize() }}>
                    {virtualItems.map((virtualRow) => {
                        const index = virtualRow.index;
                        const item = data[index];
                        return (
                            <div
                                className="absolute left-0 top-0 w-full"
                                data-index={index}
                                key={virtualRow.key}
                                ref={rowVirtualizer.measureElement}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <ItemCard extraNodes={extraNodes} index={index} item={item} workMs={workMs} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </Panel>
    );
}

const PANEL_COMPONENTS: Record<ComparisonLibraryId, React.ComponentType<ComparisonPanelProps>> = {
    'legend-list': LegendListPanel,
    'react-virtuoso': VirtuosoPanel,
    'react-window': ReactWindowPanel,
    'tanstack-virtual': TanStackVirtualPanel,
    virtua: VirtuaPanel,
};

export function VirtualListComparisonExample({ showTitle = true }: { showTitle?: boolean } = {}) {
    const [searchState, setSearchState] = React.useState<ComparisonSearchState>(DEFAULT_COMPARISON_STATE);
    const { count, extraNodes, librarySelection, workMs } = searchState;

    const data = React.useMemo(() => generateData(count), [count]);
    const visibleLibraryIds = React.useMemo(() => getVisibleComparisonLibraryIds(librarySelection), [librarySelection]);

    const updateSearchState = React.useCallback((partialState: Partial<ComparisonSearchState>) => {
        setSearchState((currentSearchState) => ({
            ...currentSearchState,
            ...partialState,
        }));
    }, []);

    return (
        <Shell showTitle={showTitle} title="Virtual List Comparison">
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
                    <div className="max-w-3xl">
                        <h2 className="m-0 text-lg font-bold text-zinc-100">Library Comparison</h2>
                        <p className="mb-0 mt-1 text-xs leading-5 text-zinc-400">
                            Compare Legend List against other popular React virtualization libraries under the same
                            variable-height workload.
                        </p>
                    </div>

                    <div className="mt-2.5 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500">Library</span>
                            <select
                                className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100"
                                onChange={(event) =>
                                    updateSearchState({
                                        librarySelection: event.target.value as ComparisonSearchState['librarySelection'],
                                    })
                                }
                                value={librarySelection}
                            >
                                <option value="all">All Libraries</option>
                                {COMPARISON_LIBRARIES.map((library) => (
                                    <option key={library.id} value={library.id}>
                                        {library.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500">CPU Work / Item</span>
                            <input
                                className="w-full accent-zinc-200"
                                max={12}
                                min={0}
                                onChange={(event) =>
                                    updateSearchState({
                                        workMs: Number(event.target.value) || 0,
                                    })
                                }
                                type="range"
                                value={workMs}
                            />
                            <span className="text-xs text-zinc-400">{workMs} ms</span>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500">Extra DOM Nodes</span>
                            <input
                                className="w-full accent-zinc-200"
                                max={60}
                                min={0}
                                onChange={(event) =>
                                    updateSearchState({
                                        extraNodes: Number(event.target.value) || 0,
                                    })
                                }
                                type="range"
                                value={extraNodes}
                            />
                            <span className="text-xs text-zinc-400">{extraNodes}</span>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500">Items</span>
                            <input
                                className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100"
                                min={5000}
                                onChange={(event) =>
                                    updateSearchState({
                                        count: Math.max(0, Number(event.target.value) || 0),
                                    })
                                }
                                type="number"
                                value={count}
                            />
                        </label>
                    </div>
                </div>

                <div className="grid gap-2 pb-3 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
                    {visibleLibraryIds.map((libraryId) => {
                        const PanelComponent = PANEL_COMPONENTS[libraryId];
                        return <PanelComponent data={data} extraNodes={extraNodes} key={libraryId} workMs={workMs} />;
                    })}
                </div>
            </div>
        </Shell>
    );
}
