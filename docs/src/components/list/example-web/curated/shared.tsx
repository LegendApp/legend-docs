import type React from "react";

import type { ChatAttachment } from '../../examples-shared/chat';

export function Shell({
    title,
    children,
    showTitle = true,
    windowScroll,
}: {
    title: string;
    children: React.ReactNode;
    showTitle?: boolean;
    windowScroll?: boolean;
}) {
    return (
        <div
            className={
                windowScroll
                    ? "flex min-w-0 w-full flex-col gap-4 text-zinc-100"
                    : "flex min-h-0 min-w-0 w-full flex-1 flex-col gap-4 text-zinc-100"
            }
        >
            {showTitle ? <h1 className="m-0 text-[34px] text-zinc-50">{title}</h1> : null}
            <div className={windowScroll ? "w-full" : "flex min-h-0 min-w-0 w-full flex-1"}>{children}</div>
        </div>
    );
}

export const CARD_CLASS = "mb-3 rounded-[18px] border border-zinc-800 bg-zinc-900/80 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.28)]";

export function cardStyle(color = "#18181b"): React.CSSProperties {
    return { background: color };
}

export function buttonStyle(active = false) {
    return [
        "cursor-pointer rounded-full border border-zinc-700 px-[14px] py-[10px] font-bold transition-colors",
        active ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-zinc-100",
    ].join(" ");
}

export const listViewportStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
};

export function ChatAttachmentCard({ attachment }: { attachment: ChatAttachment }) {
    return (
        <div
            className="mb-[10px] flex w-[220px] flex-col items-start justify-end overflow-hidden rounded-2xl p-3 text-white"
            style={{
                background: attachment.accent,
                height: attachment.height,
            }}
        >
            <div className="text-xs font-extrabold uppercase tracking-[0.5px] opacity-[0.88]">{attachment.label}</div>
            <div className="mt-1.5 text-[20px] font-extrabold">{attachment.subtitle}</div>
        </div>
    );
}
