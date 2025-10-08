'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { BiPencil } from 'react-icons/bi';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import '@/styles/state-editor.css';
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

type TransformExample = {
    pattern: string;
    replacement: string;
    flags?: string;
    mode?: 'literal' | 'regex';
};

interface Props {
    code: string;
    scope?: Record<string, unknown>;
    name?: string;
    noInline?: boolean;
    renderCode?: string;
    previewWidth?: number;
    classNameEditor?: string;
    classNamePreview?: string;
    inBox?: boolean;
    hideCode?: boolean;
    hideDemo?: boolean;
    showEditing?: boolean;
    noError?: boolean;
    disabled?: boolean;
    transformCode?: (code: string) => string;
    transformExamples?: TransformExample[];
    transformCodePreset?: string;
    removeClassNames?: boolean;
    previewCallout?: React.ReactNode;
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

// FlashingDiv component for showing re-renders
const FlashingDiv = ({ pad, span, children }: { pad?: boolean; span?: boolean; children: React.ReactNode }) => {
    const [flash, setFlash] = useState(false);

    React.useEffect(() => {
        setFlash(true);
        const timer = setTimeout(() => setFlash(false), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <span className={classNames('relative', span ? 'inline-block p-1' : 'block p-1')}>
            <div
                className={classNames(
                    'absolute inset-0 bg-blue-500 rounded-lg transition-opacity duration-200',
                    flash ? 'opacity-20' : 'opacity-0',
                )}
            />
            <span
                className={classNames(
                    'relative z-10 bg-fd-secondary border border-fd-border text-white rounded-lg',
                    pad && 'p-4',
                    span ? 'px-2' : 'block',
                )}
            >
                {children}
            </span>
        </span>
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

// Mock Motion components for Legend Motion examples
const Motion = {
    View: ({ children, style, ...props }: { children?: React.ReactNode; style?: object; [key: string]: unknown }) => (
        <View style={style} {...props}>
            {children}
        </View>
    ),
    Text: ({ children, style, ...props }: { children?: React.ReactNode; style?: object; [key: string]: unknown }) => (
        <Text style={style} {...props}>
            {children}
        </Text>
    ),
    Pressable: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
        <Pressable {...props}>{children}</Pressable>
    ),
};

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

export function Editor({
    code,
    scope = {},
    name,
    previewWidth,
    renderCode,
    classNameEditor,
    classNamePreview,
    transformCode,
    transformExamples,
    hideCode = false,
    hideDemo = false,
    showEditing = true,
    noInline = false,
    noError = false,
    disabled = false,
    removeClassNames = false,
    previewCallout,
    inBox = false,
}: Props) {
    const trimmedCode = code.trim();
    const [liveCode, setLiveCode] = useState(trimmedCode);
    const documentTitle$ = useObservable('');
    const setDocumentTitle = (value: string) => documentTitle$.set(value);

    // Detect if code contains document.title assignment
    const hasDocumentTitle = /document\.title\s*=/.test(liveCode);

    // Add setDocumentTitle to scope when document.title is used
    const mergedScope = hasDocumentTitle
        ? { ...defaultScope, ...scope, setDocumentTitle }
        : { ...defaultScope, ...scope };

    // Use transform function directly
    const transformFn = transformCode;

    // Apply a set of literal or regex replacements to the code
    const applyTransformExamples = (codeToTransform: string) => {
        if (!transformExamples?.length) return codeToTransform;

        return transformExamples.reduce((acc, { pattern, replacement, flags, mode }) => {
            if (!pattern) return acc;

            // Default to literal replacement to avoid accidental regex injection
            if (mode === 'regex') {
                try {
                    const regex = new RegExp(pattern, flags ?? 'g');
                    return acc.replace(regex, replacement);
                } catch (error) {
                    // Fall back to original value if regex fails to compile
                    return acc;
                }
            }

            // Literal replacement across entire string
            return acc.split(pattern).join(replacement);
        }, codeToTransform);
    };

    // Transform function to replace document.title with setDocumentTitle
    const documentTitleTransform = (code: string) => {
        return code.replace(/document\.title\s*=\s*([^;\n]+)/g, 'requestAnimationFrame(() => setDocumentTitle($1))');
    };

    return (
        <LiveProvider
            code={liveCode}
            transformCode={(output) => {
                let transformedOutput = removeImports(output);
                if (removeClassNames) transformedOutput = removeClassNamesFromCode(transformedOutput);
                transformedOutput = applyTransformExamples(transformedOutput);
                if (transformFn) transformedOutput = transformFn(transformedOutput);
                if (hasDocumentTitle) transformedOutput = documentTitleTransform(transformedOutput);
                return transformedOutput + (renderCode || '');
            }}
            scope={mergedScope}
            enableTypeScript={true}
            theme={emptyTheme}
            disabled={disabled}
            noInline={noInline}
            language="tsx"
        >
            <div className="flex gap-4 text-sm items-center">
                {!hideCode && (
                    <div className={classNames('relative flex-1', classNameEditor)}>
                        <div className="p-4 rounded-lg font-mono text-sm overflow-auto [&_pre]:bg-none! [--color-bg-code-block:transparent]">
                            <LiveEditor
                                onChange={(e) => {
                                    setLiveCode(e);
                                }}
                                className="liveEditor z-10 relative mr-5! w-auto!"
                            />
                            <div className="absolute inset-0 [&_code]:opacity-0">
                                <DynamicCodeBlock lang="tsx" code={liveCode} />
                            </div>
                        </div>
                        {showEditing && (
                            <div
                                className={classNames(
                                    'absolute top-3 right-12 !mt-0 flex items-center bg-blue-600 text-white px-2 py-1 rounded-md text-xs cursor-default shadow-md',
                                )}
                            >
                                <BiPencil className="mr-1 w-3 h-3" />
                                Live Editing
                            </div>
                        )}
                    </div>
                )}
                {!hideDemo && (
                    <div
                        className={classNames(
                            'border rounded-lg bg-white dark:bg-fd-card dark:border-fd-border',
                            inBox && 'p-4',
                            name ? `preview-${name}` : 'col-span-1',
                            classNamePreview,
                        )}
                        style={{ width: previewWidth }}
                    >
                        <Memo>
                            {() =>
                                hasDocumentTitle && (
                                    <div className="px-4 py-2 border-b border-zinc-200 dark:border-fd-border bg-zinc-50 dark:bg-fd-card text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {documentTitle$.get() ? documentTitle$.get() : ''}
                                    </div>
                                )
                            }
                        </Memo>
                        <LivePreview />
                        {previewCallout}
                    </div>
                )}
            </div>
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
    );
}
