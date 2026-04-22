import React from "react";

import { LegendList } from "@legendapp/list/react";
import { buildInboxNotifications, type InboxNotification } from '../../examples-shared/commerce';
import { buttonStyle, Shell } from "./shared";

const INITIAL_UNREAD_COUNT = 18;
const notificationTitles = ["Fraud check", "Payment summary", "Activity alert", "Team update"] as const;
const notificationBodies = [
    "A new payout settled, and the summary row expanded without shifting the visible window.",
    "Three new reactions arrived on the shared release checklist while the unread badge stayed anchored.",
    "A fresh audit note landed above the current viewport, so this surface now tests prepend stability too.",
    "Someone mentioned the inbox demo in a thread about maintainVisibleContentPosition behaving correctly on live inserts.",
] as const;

const initialInboxItems = buildInboxNotifications().map((item, index) => ({
    ...item,
    isUnread: index < INITIAL_UNREAD_COUNT,
}));

function buildLiveNotifications(start: number, count: number) {
    return Array.from({ length: count }, (_, offset) => {
        const sequence = start + offset;

        return {
            body: notificationBodies[sequence % notificationBodies.length]!,
            id: `notification-live-${sequence}`,
            isUnread: true,
            timeLabel: offset === 0 ? "Now" : `${offset}m`,
            title: notificationTitles[sequence % notificationTitles.length]!,
        } satisfies InboxNotification;
    });
}

export function NotificationsInboxExample({ showTitle = true }: { showTitle?: boolean } = {}) {
    const [items, setItems] = React.useState(() => initialInboxItems);
    const nextNotificationRef = React.useRef(1);

    const unreadCount = React.useMemo(() => items.filter((item) => item.isUnread).length, [items]);
    const readCount = items.length - unreadCount;

    const prependNotifications = React.useCallback((count: number) => {
        const nextBatch = buildLiveNotifications(nextNotificationRef.current, count);
        nextNotificationRef.current += count;
        setItems((prev) => [...nextBatch, ...prev]);
    }, []);

    const handleViewableItemsChanged = React.useCallback(
        ({ viewableItems }: { viewableItems: Array<{ item: InboxNotification }> }) => {
            const visibleIds = new Set(viewableItems.map((token) => token.item.id));
            if (visibleIds.size === 0) {
                return;
            }

            setItems((current) => {
                let didChange = false;
                const nextItems = current.map((item) => {
                    if (!item.isUnread || !visibleIds.has(item.id)) {
                        return item;
                    }

                    didChange = true;
                    return { ...item, isUnread: false };
                });

                return didChange ? nextItems : current;
            });
        },
        [],
    );

    return (
        <Shell showTitle={showTitle} title="Notifications Inbox">
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="mb-3 flex items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                            Unread Inbox
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-950">
                                {unreadCount} unread
                            </span>
                            <span className="text-sm text-zinc-400">{readCount} marked read after entering view</span>
                        </div>
                        <div className="mt-2 text-sm text-zinc-400">
                            Notifications flip to read once they are mostly visible, and prepending new rows keeps the
                            current viewport anchored.
                        </div>
                    </div>
                    <button className={buttonStyle()} onClick={() => prependNotifications(3)} type="button">
                        Add 3 newer
                    </button>
                </div>
                <LegendList
                    className="min-h-0 min-w-0 flex-1"
                    contentContainerStyle={{ padding: 8 }}
                    data={items}
                    estimatedItemSize={76}
                    keyExtractor={(item) => item.id}
                    maintainVisibleContentPosition
                    onViewableItemsChanged={handleViewableItemsChanged}
                    renderItem={({ item }: { item: InboxNotification }) => (
                        <div
                            className={`mb-3 rounded-[18px] border p-4 transition-colors ${item.isUnread ? "border-zinc-500/60 bg-zinc-800/70" : "border-zinc-800 bg-zinc-900/80"}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="font-extrabold text-zinc-100">{item.title}</div>
                                    <div className="mt-1.5 text-zinc-300">{item.body}</div>
                                </div>
                                {item.isUnread ? (
                                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-950">
                                        Unread
                                    </span>
                                ) : (
                                    <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                                        Read
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 text-zinc-500">{item.timeLabel}</div>
                        </div>
                    )}
                    viewabilityConfig={{
                        id: "notifications-inbox-read",
                        itemVisiblePercentThreshold: 60,
                        minimumViewTime: 120,
                    }}
                />
            </div>
        </Shell>
    );
}
