import React, { memo } from "react";

import { LegendList, type LegendListRenderItemProps, useRecyclingState } from "@legendapp/list/react";
import { buildFeedCards, type FeedCard, type FeedPollOption } from '../../examples-shared/commerce';
import { buttonStyle, CARD_CLASS, Shell } from "./shared";

const feedCards = buildFeedCards();

function pollVotesForOption(optionId: string, option: FeedPollOption, selectedOptionId: string | null) {
    return option.votes + (selectedOptionId === optionId ? 1 : 0);
}

const FeedCardItem = memo(({ item, extraData }: LegendListRenderItemProps<FeedCard>) => {
    const [isExpandedValue, setExpanded] = extraData?.recycleState
        ? useRecyclingState(() => false)
        : React.useState(false);
    const [isLikedValue, setLiked] = extraData?.recycleState ? useRecyclingState(() => false) : React.useState(false);
    const [selectedOptionIdValue, setSelectedOptionId] = extraData?.recycleState
        ? useRecyclingState<string | null>(() => null)
        : React.useState<string | null>(null);

    const isExpanded = Boolean(isExpandedValue);
    const isLiked = Boolean(isLikedValue);
    const selectedOptionId = selectedOptionIdValue ?? null;

    return (
        <div className={CARD_CLASS}>
            <div className="mb-3 flex items-center gap-3">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-full font-extrabold text-[#020617]"
                    style={{
                        background: item.accentColor,
                    }}
                >
                    {item.author.slice(0, 1)}
                </div>
                <div className="flex-1">
                    <div className="font-extrabold">{item.author}</div>
                    <div className="text-[13px] text-zinc-400">{item.timestampLabel}</div>
                </div>
                <div className="rounded-full bg-zinc-800 px-[10px] py-[6px] text-xs font-bold capitalize text-zinc-300">
                    {item.kind}
                </div>
            </div>

            {item.kind === "story" ? (
                <>
                    <div className="mb-[10px] inline-block rounded-full bg-zinc-800 px-[10px] py-[6px] text-xs font-bold text-zinc-300">
                        {item.categoryLabel}
                    </div>
                    <div className="text-lg font-extrabold">{item.title}</div>
                    <div className="mt-[10px] leading-[1.55] text-zinc-300">{item.body}</div>
                </>
            ) : null}

            {item.kind === "photo" ? (
                <>
                    <div
                        className="mb-3 flex flex-col justify-end rounded-[18px] p-[14px] text-[#020617]"
                        style={{
                            background: item.accentColor,
                            height: item.mediaHeight,
                        }}
                    >
                        <div className="text-xs font-extrabold uppercase opacity-[0.72]">{item.mediaLabel}</div>
                        <div className="mt-1.5 text-[20px] font-extrabold">{item.title}</div>
                        <div className="mt-1.5 max-w-[260px] opacity-[0.78]">{item.mediaSubtitle}</div>
                    </div>
                    <div className="leading-[1.55] text-zinc-300">{item.body}</div>
                </>
            ) : null}

            {item.kind === "poll" ? (
                <>
                    <div className="text-lg font-extrabold">{item.title}</div>
                    <div className="mt-[10px] leading-[1.55] text-zinc-300">{item.body}</div>
                    <div className="mt-[14px] grid gap-[10px]">
                        {item.pollOptions.map((option) => {
                            const votes = pollVotesForOption(option.id, option, selectedOptionId);
                            const totalVotes = item.totalVotes + (selectedOptionId ? 1 : 0);
                            const width = `${Math.max(18, Math.round((votes / totalVotes) * 100))}%`;
                            const isSelected = selectedOptionId === option.id;
                            return (
                                <button
                                    className="cursor-pointer overflow-hidden rounded-2xl p-0 text-left"
                                    key={option.id}
                                    onClick={() => {
                                        if (!isSelected) {
                                            setSelectedOptionId(option.id);
                                        }
                                    }}
                                    style={{
                                        background: isSelected ? "rgba(161, 161, 170, 0.18)" : "#18181b",
                                        border: isSelected ? "1px solid rgba(212, 212, 216, 0.55)" : "1px solid rgba(113, 113, 122, 0.35)",
                                    }}
                                    type="button"
                                >
                                    <div
                                        className="h-full px-[14px] py-3"
                                        style={{
                                            background: isSelected ? "rgba(161, 161, 170, 0.22)" : "rgba(113, 113, 122, 0.18)",
                                            height: "100%",
                                            minWidth: width,
                                        }}
                                    >
                                        <div className="font-bold">{option.label}</div>
                                        <div className="mt-1 text-xs text-zinc-400">{votes} votes</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : null}

            {item.kind === "quote" ? (
                <>
                    <div
                        className="rounded-2xl bg-zinc-900 p-4"
                        style={{
                            borderLeft: `4px solid ${item.accentColor}`,
                        }}
                    >
                        <div className="text-[20px] leading-[1.5] font-bold text-zinc-100">"{item.quote}"</div>
                        <div className="mt-[10px] text-zinc-400">{item.source}</div>
                    </div>
                    <div className="mt-3 leading-[1.55] text-zinc-300">{item.body}</div>
                </>
            ) : null}

            {item.kind === "event" ? (
                <>
                    <div className="mb-3 flex gap-2">
                        <div className="rounded-full bg-emerald-500/15 px-[10px] py-[6px] text-xs font-bold text-emerald-300">
                            {item.highlight}
                        </div>
                        <div className="rounded-full bg-zinc-800 px-[10px] py-[6px] text-xs font-bold text-zinc-300">
                            {item.attendeesLabel}
                        </div>
                    </div>
                    <div className="text-lg font-extrabold">{item.title}</div>
                    <div className="mt-[10px] leading-[1.55] text-zinc-300">{item.body}</div>
                    <div className="mt-3 text-zinc-400">{item.location}</div>
                </>
            ) : null}

            {item.kind !== "poll" && isExpanded ? (
                <div className="mt-[14px] leading-[1.6] text-zinc-300">{item.expandedBody}</div>
            ) : null}

            <div className="mt-4 flex gap-[10px]">
                <button className={buttonStyle(isLiked)} onClick={() => setLiked((current) => !current)} type="button">
                    {isLiked ? "Liked" : "Like"} · {item.reactionCount + (isLiked ? 1 : 0)}
                </button>
                <div className="self-center text-[13px] text-zinc-400">{item.commentCount} comments</div>
                {item.kind !== "poll" ? (
                    <button className={buttonStyle()} onClick={() => setExpanded((current) => !current)} type="button">
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
                ) : null}
            </div>
        </div>
    );
});

export function CardsFeedExample({ showTitle = true }: { showTitle?: boolean } = {}) {
    return (
        <Shell showTitle={showTitle} title="Cards Feed" windowScroll>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="rounded-[20px] border border-zinc-800 bg-zinc-900/80 p-4 text-zinc-400">
                    <div className="font-extrabold text-zinc-50">Window scroll example</div>
                    <div className="mt-2 leading-[1.6]">
                        This example uses the browser window as the scroll container. There is normal page content above
                        and below the list so the page stays scrollable.
                    </div>
                </div>

                <LegendList
                    className="rounded-[26px] border border-zinc-800 bg-zinc-950"
                    contentContainerStyle={{ padding: 8 }}
                    data={feedCards}
                    estimatedItemSize={286}
                    extraData={{ recycleState: true }}
                    keyExtractor={(item) => item.id}
                    renderItem={FeedCardItem}
                />

                <div className="rounded-[20px] border border-zinc-800 bg-zinc-900/80 p-4 text-zinc-400">
                    <div className="font-extrabold text-zinc-50">Below the list</div>
                    <div className="mt-2 leading-[1.6]">
                        Keeping regular content after the list makes it clear that the document is scrolling instead of
                        an internal list viewport.
                    </div>
                </div>
            </div>
        </Shell>
    );
}
