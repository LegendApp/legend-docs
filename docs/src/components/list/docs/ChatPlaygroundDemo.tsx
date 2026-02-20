'use client';

import { LegendList, type LegendListRef } from '@legendapp/list/react';
import React from 'react';

const INCOMING_SPEED_OPTIONS = [1, 2, 3, 4, 5] as const;
const LOAD_OLDER_DELAY_OPTIONS = [0, 250, 500, 1000, 1500] as const;
const THRESHOLD_OPTIONS = Array.from({ length: 11 }, (_, index) => Number((index / 10).toFixed(1)));
const REACTION_OPTIONS = ['👍', '❤️', '😂', '🎉', '👀'] as const;
const PREPEND_BATCH_SIZE = 20;

type Sender = 'me' | 'other';

type ChatMessage = {
    id: string;
    sender: Sender;
    text: string;
    timestamp: number;
    reactions: string[];
};

type DayRow = {
    id: string;
    dayKey: string;
    label: string;
    type: 'day';
};

type MessageRow = {
    id: string;
    message: ChatMessage;
    type: 'message';
};

type TypingRow = {
    id: string;
    dayKey: string;
    type: 'typing';
};

type ChatRow = DayRow | MessageRow | TypingRow;

const shortTemplates = [
    'On it.',
    'Looks good to me.',
    'Can you share a screenshot?',
    'That fixed it. Thanks!',
];

const mediumTemplates = [
    'I moved the list into a fixed-height container and the scrolling feels much smoother now.',
    'Can we make the sticky date separators a bit more subtle so they do not overpower the messages?',
    'I am testing this on Safari too to make sure scroll anchoring behaves the same as Chrome.',
];

const longTemplates = [
    'I just tried loading older messages from the top while receiving new ones, and the viewport stayed stable. This is exactly the chat behavior we wanted in production.',
    'The message row heights are intentionally mixed here: single-line responses, multiline notes, and simulated attachment blocks. That combination is useful for validating measurement accuracy.',
    'When we tweak maintainScrollAtEndThreshold we can clearly see how strict or forgiving bottom-follow becomes, which makes this demo a good teaching tool for product teams.',
];

const attachmentTemplates = [
    'Design review notes:\n• Confirm sticky day headers\n• Keep input docked\n• Verify unread marker behavior',
    'Attachment: sprint-plan.pdf\nPages: 7\nSummary: Timeline updated after API migration',
    'Release checklist:\n1. Run smoke tests\n2. Validate chat replay\n3. Monitor scroll metrics',
];

function ChatMessageItem({
    message,
    onAddReaction,
}: {
    message: ChatMessage;
    onAddReaction: (messageId: string, emoji: string) => void;
}) {
    const isMine = message.sender === 'me';
    const [isReactionMenuOpen, setIsReactionMenuOpen] = React.useState(false);

    React.useEffect(() => {
        setIsReactionMenuOpen(false);
    }, [message.id]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                padding: '6px 16px',
            }}
        >
            <div
                style={{
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '80%',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        alignItems: 'flex-end',
                        display: 'flex',
                        flexDirection: isMine ? 'row-reverse' : 'row',
                        gap: 8,
                        width: '100%',
                    }}
                >
                    <div style={{ flexShrink: 0, position: 'relative' }}>
                        <button
                            onClick={() => setIsReactionMenuOpen((previous) => !previous)}
                            style={{
                                alignItems: 'center',
                                background: '#18181b',
                                border: '1px solid #3f3f46',
                                borderRadius: 9999,
                                color: '#d4d4d8',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                flexShrink: 0,
                                fontSize: 12,
                                height: 28,
                                justifyContent: 'center',
                                minHeight: 28,
                                minWidth: 28,
                                padding: 0,
                                width: 28,
                            }}
                            title="Add reaction"
                            type="button"
                        >
                            +
                        </button>

                        {isReactionMenuOpen ? (
                            <div
                                style={{
                                    background: '#18181b',
                                    border: '1px solid #3f3f46',
                                    borderRadius: 10,
                                    boxShadow: '0 8px 22px rgba(0, 0, 0, 0.4)',
                                    display: 'flex',
                                    gap: 6,
                                    left: isMine ? 'auto' : 0,
                                    padding: 6,
                                    position: 'absolute',
                                    right: isMine ? 0 : 'auto',
                                    top: 34,
                                    zIndex: 10,
                                }}
                            >
                                {REACTION_OPTIONS.map((emoji) => (
                                    <button
                                        key={`${message.id}-${emoji}`}
                                        onClick={() => {
                                            onAddReaction(message.id, emoji);
                                            setIsReactionMenuOpen(false);
                                        }}
                                        style={{
                                            background: '#27272a',
                                            border: '1px solid #3f3f46',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            fontSize: 16,
                                            lineHeight: 1,
                                            padding: '6px 8px',
                                        }}
                                        type="button"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div
                        style={{
                            background: isMine ? '#2563eb' : '#18181b',
                            borderRadius: 16,
                            color: isMine ? '#ffffff' : '#e4e4e7',
                            overflow: 'hidden',
                            padding: '10px 12px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: 14,
                                lineHeight: 1.5,
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {message.text}
                        </div>

                        {message.reactions.length > 0 ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 6,
                                    marginTop: 8,
                                }}
                            >
                                {message.reactions.map((reaction, index) => (
                                    <span
                                        key={`${message.id}-reaction-${index}`}
                                        style={{
                                            background: isMine ? 'rgba(255,255,255,0.22)' : '#3f3f46',
                                            borderRadius: 9999,
                                            color: '#f4f4f5',
                                            fontSize: 13,
                                            padding: '2px 8px',
                                        }}
                                    >
                                        {reaction}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div
                    style={{
                        color: '#a1a1aa',
                        fontSize: 11,
                        marginTop: 4,
                    }}
                >
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}

function toDayKey(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDayLabel(dayKey: string): string {
    const now = new Date();
    const todayKey = toDayKey(now.getTime());
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = toDayKey(yesterday.getTime());

    if (dayKey === todayKey) return 'Today';
    if (dayKey === yesterdayKey) return 'Yesterday';

    const [year, month, day] = dayKey.split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, day || 1);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function buildMixedMessageText(index: number): string {
    if (index % 7 === 0) return attachmentTemplates[index % attachmentTemplates.length];
    if (index % 4 === 0) return longTemplates[index % longTemplates.length];
    if (index % 2 === 0) return mediumTemplates[index % mediumTemplates.length];
    return shortTemplates[index % shortTemplates.length];
}

function createSeedMessages(getNextId: () => string): ChatMessage[] {
    const now = Date.now();
    const start = now - 1000 * 60 * 60 * 48;
    const totalMessages = 64;
    const span = now - start;

    return Array.from({ length: totalMessages }, (_, index) => {
        const progress = index / (totalMessages - 1);
        const timestamp = Math.floor(start + progress * span);
        const sender: Sender = index % 3 === 0 ? 'other' : 'me';
        return {
            id: getNextId(),
            reactions: [],
            sender,
            text: buildMixedMessageText(index),
            timestamp,
        };
    });
}

function createOlderBatch(getNextId: () => string, beforeTimestamp: number, indexSeed: number): ChatMessage[] {
    const messages: ChatMessage[] = [];
    let cursor = beforeTimestamp;

    for (let index = 0; index < PREPEND_BATCH_SIZE; index++) {
        const minutes = 2 + ((index + indexSeed) % 5);
        cursor -= minutes * 60 * 1000;
        messages.push({
            id: getNextId(),
            reactions: [],
            sender: index % 2 === 0 ? 'other' : 'me',
            text: buildMixedMessageText(indexSeed + index),
            timestamp: cursor,
        });
    }

    return messages.reverse();
}

function createIncomingMessage(getNextId: () => string, index: number): ChatMessage {
    return {
        id: getNextId(),
        reactions: [],
        sender: 'other',
        text: buildMixedMessageText(index),
        timestamp: Date.now(),
    };
}

function buildRows(messages: ChatMessage[], includeTypingRow: boolean): { rows: ChatRow[]; stickyHeaderIndices: number[] } {
    const rows: ChatRow[] = [];
    const stickyHeaderIndices: number[] = [];
    let lastDayKey = '';

    for (const message of messages) {
        const dayKey = toDayKey(message.timestamp);
        if (dayKey !== lastDayKey) {
            stickyHeaderIndices.push(rows.length);
            rows.push({
                dayKey,
                id: `day-${dayKey}`,
                label: formatDayLabel(dayKey),
                type: 'day',
            });
            lastDayKey = dayKey;
        }

        rows.push({
            id: message.id,
            message,
            type: 'message',
        });
    }

    if (includeTypingRow) {
        const typingDayKey = toDayKey(Date.now());
        if (typingDayKey !== lastDayKey) {
            stickyHeaderIndices.push(rows.length);
            rows.push({
                dayKey: typingDayKey,
                id: `day-${typingDayKey}`,
                label: formatDayLabel(typingDayKey),
                type: 'day',
            });
        }

        rows.push({
            dayKey: typingDayKey,
            id: 'typing-indicator',
            type: 'typing',
        });
    }

    return { rows, stickyHeaderIndices };
}

export function ChatPlaygroundDemo() {
    const idCounterRef = React.useRef(0);
    const createId = React.useCallback(() => {
        const id = `msg-${idCounterRef.current}`;
        idCounterRef.current += 1;
        return id;
    }, []);

    const listRef = React.useRef<LegendListRef | null>(null);
    const timeoutsRef = React.useRef<number[]>([]);
    const prependSeedRef = React.useRef(1000);
    const isLoadingOlderRef = React.useRef(false);
    const incomingMessageIndexRef = React.useRef(2000);

    const [messages, setMessages] = React.useState<ChatMessage[]>(() => createSeedMessages(createId));
    const [inputText, setInputText] = React.useState('');
    const [incomingSpeedSec, setIncomingSpeedSec] = React.useState<number>(5);
    const [loadOlderDelayMs, setLoadOlderDelayMs] = React.useState<number>(0);
    const [threshold, setThreshold] = React.useState<number>(0.1);
    const [showScrollToLatest, setShowScrollToLatest] = React.useState<boolean>(false);
    const [isTyping, setIsTyping] = React.useState<boolean>(false);
    const [isLoadingOlder, setIsLoadingOlder] = React.useState<boolean>(false);

    const { rows, stickyHeaderIndices } = React.useMemo(() => buildRows(messages, isTyping), [messages, isTyping]);

    const updateScrollToLatestVisibility = React.useCallback(() => {
        const state = listRef.current?.getState?.() as { isAtEnd?: boolean } | undefined;
        if (state?.isAtEnd === undefined) return;
        setShowScrollToLatest(!state.isAtEnd);
    }, []);

    React.useEffect(() => {
        const raf = requestAnimationFrame(() => updateScrollToLatestVisibility());
        return () => cancelAnimationFrame(raf);
    }, [rows.length, threshold, updateScrollToLatestVisibility]);

    React.useEffect(() => {
        const clearAllTimeouts = () => {
            for (const timeoutId of timeoutsRef.current) {
                window.clearTimeout(timeoutId);
            }
            timeoutsRef.current = [];
        };

        clearAllTimeouts();

        const intervalMs = incomingSpeedSec * 1000;
        const intervalId = window.setInterval(() => {
            setIsTyping(true);

            const typingDuration = Math.min(3200, Math.max(700, Math.floor(intervalMs * 0.75)));
            const timeoutId = window.setTimeout(() => {
                incomingMessageIndexRef.current += 1;
                setMessages((prev) => [...prev, createIncomingMessage(createId, incomingMessageIndexRef.current)]);
                setIsTyping(false);
            }, typingDuration);
            timeoutsRef.current.push(timeoutId);
        }, intervalMs);

        return () => {
            window.clearInterval(intervalId);
            clearAllTimeouts();
        };
    }, [createId, incomingSpeedSec]);

    const prependOlderMessages = React.useCallback(() => {
        setMessages((previous) => {
            const oldestTimestamp = previous[0]?.timestamp ?? Date.now();
            const older = createOlderBatch(createId, oldestTimestamp, prependSeedRef.current);
            prependSeedRef.current += PREPEND_BATCH_SIZE;
            return [...older, ...previous];
        });
        isLoadingOlderRef.current = false;
        setIsLoadingOlder(false);
    }, [createId]);

    const handleStartReached = React.useCallback(() => {
        if (isLoadingOlderRef.current) return;

        isLoadingOlderRef.current = true;
        setIsLoadingOlder(true);

        if (loadOlderDelayMs === 0) {
            prependOlderMessages();
            return;
        }

        const timeoutId = window.setTimeout(() => {
            prependOlderMessages();
        }, loadOlderDelayMs);
        timeoutsRef.current.push(timeoutId);
    }, [loadOlderDelayMs, prependOlderMessages]);

    const handleSendMessage = React.useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const text = inputText.trim();
            if (!text) return;

            setMessages((previous) => [
                ...previous,
                {
                    id: createId(),
                    reactions: [],
                    sender: 'me',
                    text,
                    timestamp: Date.now(),
                },
            ]);
            setInputText('');
            requestAnimationFrame(() => {
                listRef.current?.scrollToEnd?.({ animated: true });
                setShowScrollToLatest(false);
            });
        },
        [createId, inputText],
    );

    const handleAddReaction = React.useCallback((messageId: string, emoji: string) => {
        setMessages((previous) =>
            previous.map((message) =>
                message.id === messageId
                    ? {
                          ...message,
                          reactions: [...message.reactions, emoji],
                      }
                    : message,
            ),
        );
    }, []);

    const renderRow = React.useCallback(
        ({ item }: { item: ChatRow }) => {
            if (item.type === 'day') {
                return (
                    <div style={{ padding: '8px 16px', pointerEvents: 'none' }}>
                        <div
                            style={{
                                backdropFilter: 'blur(3px)',
                                background: 'rgba(24, 24, 27, 0.92)',
                                border: '1px solid #3f3f46',
                                borderRadius: 9999,
                                color: '#d4d4d8',
                                fontSize: 12,
                                fontWeight: 600,
                                margin: '0 auto',
                                maxWidth: 220,
                                padding: '4px 10px',
                                textAlign: 'center',
                            }}
                        >
                            {item.label}
                        </div>
                    </div>
                );
            }

            if (item.type === 'typing') {
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '6px 16px' }}>
                        <div
                            style={{
                                background: '#27272a',
                                borderRadius: 16,
                                color: '#e4e4e7',
                                fontSize: 14,
                                maxWidth: '72%',
                                padding: '10px 12px',
                            }}
                        >
                            Typing…
                        </div>
                    </div>
                );
            }

            return <ChatMessageItem message={item.message} onAddReaction={handleAddReaction} />;
        },
        [handleAddReaction],
    );

    const scrollToLatest = React.useCallback(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
        setShowScrollToLatest(false);
    }, []);

    return (
        <div style={{ border: '1px solid #3f3f46', borderRadius: 12, overflow: 'hidden' }}>
            <div
                style={{
                    background: '#111214',
                    borderBottom: '1px solid #3f3f46',
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    padding: 12,
                }}
            >
                <label style={{ color: '#d4d4d8', display: 'flex', flexDirection: 'column', fontSize: 12, gap: 6 }}>
                    Incoming speed
                    <select
                        onChange={(event) => setIncomingSpeedSec(Number(event.target.value))}
                        style={{
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: 8,
                            color: '#e4e4e7',
                            fontSize: 13,
                            padding: '8px 10px',
                        }}
                        value={incomingSpeedSec}
                    >
                        {INCOMING_SPEED_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                Every {option} second{option > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ color: '#d4d4d8', display: 'flex', flexDirection: 'column', fontSize: 12, gap: 6 }}>
                    Load older delay
                    <select
                        onChange={(event) => setLoadOlderDelayMs(Number(event.target.value))}
                        style={{
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: 8,
                            color: '#e4e4e7',
                            fontSize: 13,
                            padding: '8px 10px',
                        }}
                        value={loadOlderDelayMs}
                    >
                        {LOAD_OLDER_DELAY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}ms
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ color: '#d4d4d8', display: 'flex', flexDirection: 'column', fontSize: 12, gap: 6 }}>
                    maintainScrollAtEndThreshold
                    <select
                        onChange={(event) => setThreshold(Number(event.target.value))}
                        style={{
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: 8,
                            color: '#e4e4e7',
                            fontSize: 13,
                            padding: '8px 10px',
                        }}
                        value={threshold}
                    >
                        {THRESHOLD_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option.toFixed(1)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div style={{ background: '#0d0f12', display: 'flex', flexDirection: 'column', height: 680, minHeight: 0, position: 'relative' }}>
                {isLoadingOlder ? (
                    <div
                        style={{
                            background: 'rgba(161, 161, 170, 0.12)',
                            borderBottom: '1px solid #3f3f46',
                            color: '#d4d4d8',
                            fontSize: 12,
                            padding: '6px 12px',
                            textAlign: 'center',
                        }}
                    >
                        Loading older messages…
                    </div>
                ) : null}

                <LegendList<ChatRow>
                    alignItemsAtEnd
                    contentContainerStyle={{ paddingBottom: 12, paddingTop: 8 }}
                    data={rows}
                    estimatedItemSize={90}
                    initialScrollIndex={Math.max(rows.length - 1, 0)}
                    keyExtractor={(item) => item.id}
                    maintainScrollAtEnd
                    maintainScrollAtEndThreshold={threshold}
                    maintainVisibleContentPosition
                    onScroll={updateScrollToLatestVisibility}
                    onStartReached={handleStartReached}
                    onStartReachedThreshold={0.2}
                    ref={listRef}
                    renderItem={renderRow}
                    stickyHeaderIndices={stickyHeaderIndices}
                    style={{ background: '#0d0f12', flex: 1, minHeight: 0 }}
                />

                {showScrollToLatest ? (
                    <button
                        aria-label="Scroll to latest"
                        onClick={scrollToLatest}
                        style={{
                            background: '#1d4ed8',
                            border: 'none',
                            borderRadius: 9999,
                            bottom: 74,
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 36,
                            position: 'absolute',
                            right: 16,
                            width: 36,
                        }}
                        title="Scroll to latest"
                        type="button"
                    >
                        <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
                            <path
                                d="M4 6L8 10L12 6"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                            />
                        </svg>
                    </button>
                ) : null}

                <form
                    onSubmit={handleSendMessage}
                    style={{
                        alignItems: 'center',
                        background: '#111214',
                        borderTop: '1px solid #3f3f46',
                        display: 'flex',
                        gap: 8,
                        padding: 10,
                    }}
                >
                    <input
                        onChange={(event) => setInputText(event.target.value)}
                        placeholder="Send a message..."
                        style={{
                            background: '#18181b',
                            border: '1px solid #3f3f46',
                            borderRadius: 9999,
                            color: '#e4e4e7',
                            flex: 1,
                            fontSize: 14,
                            minWidth: 0,
                            padding: '10px 14px',
                        }}
                        value={inputText}
                    />
                    <button
                        style={{
                            background: '#2563eb',
                            border: 'none',
                            borderRadius: 9999,
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: '10px 16px',
                        }}
                        type="submit"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
