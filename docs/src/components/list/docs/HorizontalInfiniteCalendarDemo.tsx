'use client';

import { LegendList, type LegendListRef } from '@legendapp/list/react';
import React from 'react';

const MONTHS_IN_VIEW = 3;
const INITIAL_WINDOW_SIZE = 5;
const EXTEND_BY = 5;
const INITIAL_LEFT_INDEX = 1;
const DAYS_IN_GRID = 42;
const EPOCH_YEAR = 1970;
const CALENDAR_VIEWPORT_HEIGHT = 320;

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
});

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type MonthCell = {
    date: Date;
    inMonth: boolean;
    isToday: boolean;
};

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(' ');
}

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

function yearMonthToOffset(year: number, month: number): number {
    return (year - EPOCH_YEAR) * 12 + month;
}

function offsetToYearMonth(offset: number): { year: number; month: number } {
    const year = EPOCH_YEAR + Math.floor(offset / 12);
    const month = ((offset % 12) + 12) % 12;
    return { month, year };
}

function monthLabel(offset: number): string {
    const { year, month } = offsetToYearMonth(offset);
    return MONTH_LABEL_FORMATTER.format(new Date(year, month, 1));
}

function buildMonthOffsets(startOffset: number, count: number): number[] {
    return Array.from({ length: count }, (_, index) => startOffset + index);
}

function buildMonthGrid(offset: number): MonthCell[] {
    const { year, month } = offsetToYearMonth(offset);
    const firstDay = new Date(year, month, 1);
    const start = new Date(year, month, 1 - firstDay.getDay());
    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    return Array.from({ length: DAYS_IN_GRID }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);

        return {
            date,
            inMonth: date.getMonth() === month,
            isToday: date.getFullYear() === todayYear && date.getMonth() === todayMonth && date.getDate() === todayDate,
        };
    });
}

export function HorizontalInfiniteCalendarDemo() {
    const listRef = React.useRef<LegendListRef | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const now = React.useMemo(() => new Date(), []);
    const todayOffset = React.useMemo(() => yearMonthToOffset(now.getFullYear(), now.getMonth()), [now]);

    const [months, setMonths] = React.useState<number[]>(() =>
        buildMonthOffsets(todayOffset - INITIAL_LEFT_INDEX - 1, INITIAL_WINDOW_SIZE),
    );
    const [leftIndex, setLeftIndex] = React.useState(INITIAL_LEFT_INDEX);
    const [viewportWidth, setViewportWidth] = React.useState(0);

    const monthsRef = React.useRef(months);
    const leftIndexRef = React.useRef(leftIndex);

    const setMonthsSynced = React.useCallback((nextMonths: number[]) => {
        monthsRef.current = nextMonths;
        setMonths(nextMonths);
    }, []);

    const setLeftIndexSynced = React.useCallback((nextLeftIndex: number) => {
        leftIndexRef.current = nextLeftIndex;
        setLeftIndex(nextLeftIndex);
    }, []);

    const scrollToIndexNextFrame = React.useCallback((index: number, animated: boolean) => {
        requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({ animated, index });
        });
    }, []);

    React.useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const update = () => setViewportWidth(node.clientWidth);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    const itemWidth = React.useMemo(() => {
        if (!viewportWidth) return 360;
        return Math.max(240, viewportWidth / MONTHS_IN_VIEW);
    }, [viewportWidth]);

    const prependMonths = React.useCallback((nextLeftIndex?: number) => {
        const currentMonths = monthsRef.current;
        const firstOffset = currentMonths[0];
        const prepended = buildMonthOffsets(firstOffset - EXTEND_BY, EXTEND_BY);
        const nextMonths = [...prepended, ...currentMonths];

        const shiftedIndex = leftIndexRef.current + EXTEND_BY;
        const resolvedIndex = nextLeftIndex ?? shiftedIndex;

        setMonthsSynced(nextMonths);
        setLeftIndexSynced(resolvedIndex);
        scrollToIndexNextFrame(resolvedIndex, false);
    }, [scrollToIndexNextFrame, setLeftIndexSynced, setMonthsSynced]);

    const appendMonths = React.useCallback(() => {
        const currentMonths = monthsRef.current;
        const lastOffset = currentMonths[currentMonths.length - 1];
        const appended = buildMonthOffsets(lastOffset + 1, EXTEND_BY);
        const nextMonths = [...currentMonths, ...appended];

        setMonthsSynced(nextMonths);
    }, [setMonthsSynced]);

    const handleStartReached = React.useCallback(() => {
        prependMonths();
    }, [prependMonths]);

    const handleEndReached = React.useCallback(() => {
        appendMonths();
    }, [appendMonths]);

    const handleMomentumEnd = React.useCallback(
        (event: { nativeEvent?: { contentOffset?: { x?: number } } }) => {
            const x = event.nativeEvent?.contentOffset?.x ?? 0;
            const maxLeft = Math.max(0, monthsRef.current.length - MONTHS_IN_VIEW);
            const snappedIndex = clamp(Math.round(x / itemWidth), 0, maxLeft);

            setLeftIndexSynced(snappedIndex);
        },
        [itemWidth, setLeftIndexSynced],
    );

    const handleScroll = React.useCallback(
        (event: { nativeEvent?: { contentOffset?: { x?: number } } }) => {
            const x = event.nativeEvent?.contentOffset?.x ?? 0;
            const maxLeft = Math.max(0, monthsRef.current.length - MONTHS_IN_VIEW);
            const nextLeftIndex = clamp(Math.round(x / itemWidth), 0, maxLeft);

            if (nextLeftIndex !== leftIndexRef.current) {
                setLeftIndexSynced(nextLeftIndex);
            }
        },
        [itemWidth, setLeftIndexSynced],
    );

    const goByMonths = React.useCallback(
        (delta: -1 | 1) => {
            const currentIndex = leftIndexRef.current;

            if (delta < 0 && currentIndex === 0) {
                prependMonths(currentIndex + EXTEND_BY + delta);
                return;
            }

            if (delta > 0 && currentIndex >= monthsRef.current.length - MONTHS_IN_VIEW) {
                appendMonths();
            }

            const maxLeft = Math.max(0, monthsRef.current.length - MONTHS_IN_VIEW);
            const target = clamp(currentIndex + delta, 0, maxLeft);

            setLeftIndexSynced(target);
            listRef.current?.scrollToIndex({ animated: true, index: target });
        },
        [appendMonths, prependMonths, setLeftIndexSynced],
    );

    const goToToday = React.useCallback(() => {
        const nextMonths = buildMonthOffsets(todayOffset - INITIAL_LEFT_INDEX - 1, INITIAL_WINDOW_SIZE);

        setMonthsSynced(nextMonths);
        setLeftIndexSynced(INITIAL_LEFT_INDEX);
        scrollToIndexNextFrame(INITIAL_LEFT_INDEX, false);
    }, [scrollToIndexNextFrame, setLeftIndexSynced, setMonthsSynced, todayOffset]);

    const visibleCenterLabel = React.useMemo(() => {
        const centerOffset = months[leftIndex + 1] ?? months[leftIndex] ?? months[0] ?? todayOffset;
        return monthLabel(centerOffset);
    }, [leftIndex, months, todayOffset]);

    const renderMonth = React.useCallback(
        ({ item }: { item: number }) => {
            const cells = buildMonthGrid(item);

            return (
                <div className="shrink-0 px-2" style={{ width: itemWidth }}>
                    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3">
                        <div className="mb-2 text-sm font-semibold text-zinc-100">{monthLabel(item)}</div>

                        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-zinc-500">
                            {WEEKDAY_LABELS.map((label) => (
                                <div key={`${item}-${label}`}>{label}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {cells.map((cell, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className={cx(
                                        'flex h-8 items-center justify-center rounded-md text-sm',
                                        cell.isToday
                                            ? 'bg-blue-600 font-semibold text-white'
                                            : cell.inMonth
                                              ? 'text-zinc-200'
                                              : 'text-zinc-600',
                                    )}
                                >
                                    {cell.date.getDate()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        },
        [itemWidth],
    );

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-700 bg-[#0d0f12]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-700 bg-[#111214] p-3">
                <div className="text-sm font-medium text-zinc-200">{visibleCenterLabel}</div>

                <div className="flex items-center gap-2">
                    <button
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100"
                        onClick={() => goByMonths(-1)}
                        type="button"
                    >
                        Previous month
                    </button>
                    <button
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100"
                        onClick={goToToday}
                        type="button"
                    >
                        Today
                    </button>
                    <button
                        className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100"
                        onClick={() => goByMonths(1)}
                        type="button"
                    >
                        Next month
                    </button>
                </div>
            </div>

            <div ref={containerRef} style={{ height: CALENDAR_VIEWPORT_HEIGHT }}>
                <LegendList<number>
                    className="h-full min-h-0 py-4 overscroll-contain"
                    data={months}
                    estimatedItemSize={itemWidth}
                    horizontal
                    initialScrollIndex={INITIAL_LEFT_INDEX}
                    keyExtractor={(item) => String(item)}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.2}
                    onMomentumScrollEnd={handleMomentumEnd}
                    onScroll={handleScroll}
                    onStartReached={handleStartReached}
                    onStartReachedThreshold={0.2}
                    pagingEnabled={false}
                    recycleItems
                    ref={listRef}
                    renderItem={renderMonth}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={itemWidth}
                />
            </div>
        </div>
    );
}
