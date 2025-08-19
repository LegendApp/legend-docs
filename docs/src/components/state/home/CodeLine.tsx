import React from 'react';

export function CodeLine({ children }: { children: React.ReactNode }) {
    return (
        <pre
            className="!mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto"
        >
            <code className="text-gray-300">
                <span className="text-white">{children}</span>
            </code>
        </pre>
    );
}