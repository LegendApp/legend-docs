'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { observable } from '@legendapp/state';
import {
    useValue,
    useObservable,
    For,
    Memo,
    Show,
    Switch,
    reactive,
    useObserve,
    useComputed,
    Computed,
} from '@legendapp/state/react';
import { $React } from '@legendapp/state/react-web';
import { syncObservable } from '@legendapp/state/sync';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { syncedFetch } from '@legendapp/state/sync-plugins/fetch';
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { pageHash } from '@legendapp/state/helpers/pageHash';
import { pageHashParams } from '@legendapp/state/helpers/pageHashParams';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import type { Observable } from '@legendapp/state';
import { View, Text, Pressable } from 'react-native-web';
import { ExampleAnim } from './motion/ExampleAnim';
import { IntroComponent } from './motion/IntroComponent';
import { IntroUsageComponent } from './motion/IntroUsageComponent';
import { FlashingDiv } from '@/components/state/home/FlashingDiv';
import {
    CodeBlock,
    CodeBlockTab,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    Pre,
} from 'fumadocs-ui/components/codeblock';
import { Motion } from '@legendapp/motion';

interface Props {
    code1: string;
    code2: string;
    codePreview1: string;
    codePreview2: string;
    title1?: string;
    title2?: string;
    scope?: Record<string, unknown>;
    name?: string;
    noInline?: boolean;
    renderCode?: string;
    previewWidth?: number;
    classNameCode?: string;
    classNamePreview?: string;
    hideCode?: boolean;
    hideDemo?: boolean;
    noError?: boolean;
    disabled?: boolean;
    transformCode?: (code: string) => string;
    removeClassNames?: boolean;
}

const emptyTheme = { plain: {}, styles: [] };

function removeImports(code: string) {
    return code.replace(/import .*?\n/g, '');
}

function removeClassNamesFromCode(code: string) {
    return code.replace(/(class|className)\s*=\s*["']([^"']*)["']/g, '');
}

// UI Components for the live examples styled to match shared components
const Box = ({
    theme,
    children,
    className,
}: {
    theme?: 'light' | 'dark';
    children: React.ReactNode;
    className?: string;
}) => (
    <div
        className={classNames(
            'rounded-lg p-4 relative max-w-sm',
            theme === 'light' ? 'bg-fd-card text-zinc-900' : 'bg-fd-card text-zinc-100',
            className,
        )}
    >
        {children}
    </div>
);

const Button = ({
    onClick,
    children,
    className,
}: {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}) => (
    <button
        className={classNames(
            'block px-4 h-10 my-4 font-bold rounded-lg shadow text-2xs cursor-pointer transition-colors bg-zinc-600 hover:bg-zinc-500',
            className,
        )}
        onClick={onClick}
    >
        {children}
    </button>
);

const ThemeButton = ({ $value }: { $value: Observable<string> }) => {
    const theme = useValue($value);
    return (
        <div
            className="absolute right-0 top-0 size-8 flex justify-center items-center cursor-pointer hover:text-blue-500"
            onClick={() => $value.set(theme === 'dark' ? 'light' : 'dark')}
        >
            <span className="text-xs font-medium">{theme === 'dark' ? '🌙' : '☀️'}</span>
        </div>
    );
};

const Checkbox = ({ $value }: { $value: Observable<boolean> }) => {
    const checked = useValue($value);
    return (
        <div className="inline-flex items-center">
            <label className="relative flex items-center p-1 -m-1 rounded-full cursor-pointer">
                <input
                    type="checkbox"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-zinc-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-zinc-500 before:opacity-0 before:transition-opacity checked:border-blue-600 checked:bg-blue-600 checked:before:bg-blue-600 hover:before:opacity-10"
                    checked={checked || false}
                    onChange={(e) => $value.set(e.target.checked)}
                />
                <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </label>
        </div>
    );
};

// useInterval hook for examples
const useInterval = (callback: () => void, delay: number | null) => {
    React.useEffect(() => {
        if (delay !== null) {
            const id = setInterval(callback, delay);
            return () => clearInterval(id);
        }
    }, [callback, delay]);
};

// debounce utility for AutoSaving example
let timeout: ReturnType<typeof setTimeout>;
function debounce(fn: () => void, time: number) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
}

// Default scope with commonly used React elements and Legend-State functions
const defaultScope = {
    React,
    useState,
    useRef: React.useRef,
    useEffect: React.useEffect,
    createElement: React.createElement,
    Fragment: React.Fragment,
    // Legend-State functions
    observable,
    useValue,
    useObservable,
    For,
    Computed,
    Memo,
    Show,
    Switch,
    reactive,
    useObserve,
    useComputed,
    // Legend-State web components
    $React,
    // Sync and persistence
    syncObservable,
    ObservablePersistLocalStorage,
    syncedFetch,
    useObservableSyncedQuery,
    // TanStack Query
    QueryClient,
    QueryClientProvider,
    // Router helpers
    pageHash,
    pageHashParams,
    // Motion components
    motion,
    AnimatePresence,
    // HTTP client
    axios,
    // UI Components
    Box,
    Button,
    ThemeButton,
    Checkbox,
    FlashingDiv,
    // Utility hooks and functions
    useInterval,
    debounce,
    // React Native Web components
    View,
    Text,
    Pressable,
    // Motion example components
    ExampleAnim,
    IntroComponent,
    IntroUsageComponent,
    Motion,
};

export function TwoExamples({
    code1,
    code2,
    codePreview1,
    codePreview2,
    title1,
    title2,
    scope = {},
    name,
    previewWidth,
    renderCode,
    classNameCode,
    classNamePreview,
    transformCode,
    hideCode = false,
    hideDemo = false,
    noInline = false,
    noError = false,
    disabled = false,
    removeClassNames = false,
}: Props) {
    // Add setDocumentTitle to scope when document.title is used
    const mergedScope = { ...defaultScope, ...scope };

    const processCode = (code: string) => {
        let transformedOutput = removeImports(code);
        if (removeClassNames) transformedOutput = removeClassNamesFromCode(transformedOutput);
        if (transformCode) transformedOutput = transformCode(transformedOutput);
        return transformedOutput + (renderCode || '');
    };

    return (
        <div>
            {/* Code blocks side by side */}
            {!hideCode && (
                <div className="flex gap-4 text-xs">
                    <div className={classNames('relative flex-1', classNameCode)}>
                        <div className="rounded-lg font-mono text-sm overflow-auto [&_pre]:bg-none! [--color-bg-code-block:transparent]">
                            <CodeBlockTabs defaultValue="value">
                                <CodeBlockTabsList>
                                    <div className="p-2 font-bold text-fd-muted-foreground">{title1}</div>
                                </CodeBlockTabsList>
                                <CodeBlockTab value="value" asChild>
                                    <DynamicCodeBlock lang="tsx" code={code1.trim()} />
                                </CodeBlockTab>
                            </CodeBlockTabs>
                        </div>
                    </div>
                    <div className={classNames('relative flex-1', classNameCode)}>
                        <div className="rounded-lg font-mono text-sm overflow-auto [&_pre]:bg-none! [--color-bg-code-block:transparent]">
                            <CodeBlockTabs defaultValue="value">
                                <CodeBlockTabsList>
                                    <div className="p-2 font-bold text-fd-muted-foreground">{title2}</div>
                                </CodeBlockTabsList>
                                <CodeBlockTab value="value" asChild>
                                    <DynamicCodeBlock lang="tsx" code={code2.trim()} />
                                </CodeBlockTab>
                            </CodeBlockTabs>
                        </div>
                    </div>
                </div>
            )}

            {/* Live previews side by side */}
            {!hideDemo && (
                <div className="flex gap-4">
                    {/* First preview */}
                    <div className="flex-1 flex justify-center">
                        <LiveProvider
                            code={codePreview1}
                            transformCode={() => processCode(codePreview1)}
                            scope={mergedScope}
                            enableTypeScript={true}
                            theme={emptyTheme}
                            disabled={disabled}
                            noInline={noInline}
                            language="tsx"
                        >
                            <LivePreview />
                            {!noError && (
                                <LiveError
                                    style={{
                                        backgroundColor: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '0.5rem',
                                        padding: '1rem',
                                        marginTop: '1rem',
                                        color: '#dc2626',
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                />
                            )}
                        </LiveProvider>
                    </div>

                    {/* Second preview */}
                    <div className="flex-1 flex justify-center">
                        <LiveProvider
                            code={codePreview2}
                            transformCode={() => processCode(codePreview2)}
                            scope={mergedScope}
                            enableTypeScript={true}
                            theme={emptyTheme}
                            disabled={disabled}
                            noInline={noInline}
                            language="tsx"
                        >
                            <LivePreview />
                            {!noError && (
                                <LiveError
                                    style={{
                                        backgroundColor: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '0.5rem',
                                        padding: '1rem',
                                        marginTop: '1rem',
                                        color: '#dc2626',
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                />
                            )}
                        </LiveProvider>
                    </div>
                </div>
            )}
        </div>
    );
}
