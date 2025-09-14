import React from 'react';

export function CodeLine({ children }: { children: React.ReactNode }) {
    return (
        <pre className="!mt-4 bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto">
            <code className="text-zinc-300">
                <span className="text-white">{children}</span>
            </code>
        </pre>
    );
}
