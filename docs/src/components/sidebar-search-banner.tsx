'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function SidebarSearchBanner() {
    const { setOpenSearch, enabled } = useSearchContext();

    if (!enabled) return null;

    return (
        <button
            type="button"
            aria-label="Search this library"
            onClick={() => setOpenSearch(true)}
            className="flex w-full items-center justify-between rounded-lg border bg-fd-card/60 px-3 py-2 text-left text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/40 hover:text-fd-foreground"
        >
            <span className="inline-flex items-center gap-2">
                <Search className="size-4" />
                Search this library
            </span>
            <span className="rounded border px-1.5 py-0.5 text-xs">K</span>
        </button>
    );
}
