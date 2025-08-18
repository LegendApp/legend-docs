'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { BiPencil } from 'react-icons/bi';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { observable } from '@legendapp/state';
import {
    use$,
    useObservable,
    For,
    Memo,
    Show,
    Switch,
    reactive,
    useObserve,
    useComputed,
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

interface Props {
    code: string;
    scope?: Record<string, unknown>;
    name?: string;
    noInline?: boolean;
    renderCode?: string;
    previewWidth?: number;
    classNameEditor?: string;
    classNamePreview?: string;
    hideCode?: boolean;
    hideDemo?: boolean;
    showEditing?: boolean;
    noError?: boolean;
    disabled?: boolean;
    transformCode?: string; // Now a string identifier instead of function
    previewCallout?: React.ReactNode;
}

const emptyTheme = { plain: {}, styles: [] };

function removeImports(code: string) {
    return code.replace(/import .*?\n/g, '');
}

// Predefined transform functions based on original examples
const transformFunctions: Record<string, (code: string) => string> = {
    persistence: (code) =>
        code
            .replace(/className="footer"/g, 'className="bg-gray-600 text-center text-white text-sm overflow-hidden"')
            .replace(
                /className="input"/g,
                'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2"',
            ),
    autoSaving: (code) =>
        code.replace(
            /className="input"/g,
            'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2 mb-6"',
        ),
    formValidation: (code) =>
        code
            .replace(
                /className="input"/g,
                'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2"',
            )
            .replace(/className="error"/g, 'className="text-sm text-red-500 mb-2 pt-1"'),
    messageList: (code) =>
        code
            .replace(
                /className="input"/g,
                'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1"',
            )
            .replace(
                /className="messages"/g,
                'className="h-64 p-2 my-3 overflow-auto border border-gray-600 rounded [&>*]:!mt-2"',
            ),
    animatedSwitch: (code) =>
        code
            .replace(
                /className="toggle"/g,
                'className="border border-[#717173] rounded-full select-none cursor-pointer"',
            )
            .replace(/className="thumb"/g, 'className="bg-white rounded-full shadow"'),
    modal: (code) =>
        code
            .replace(/className="pageText"/g, 'className="flex-1 flex justify-center items-center"')
            .replace(
                /className="pageButton"/g,
                'className="px-4 py-2 my-4 font-bold rounded shadow text-2xs cursor-pointer bg-gray-600 hover:bg-gray-500 !mt-0"',
            )
            .replace(/className="modal"/g, 'className="relative bg-gray-700 rounded-xl flex flex-col p-4"')
            .replace(/className="modalButtons"/g, 'className="flex justify-center gap-4"'),
    primitives: (code) =>
        code.replace(
            `<div>Count: <Memo>{count$}</Memo></div>`,
            `<div>Count:{" "}
                <Memo>
                    {() => (
                        <FlashingDiv span>
                            {count$.get()}
                        </FlashingDiv>
                    )}
                </Memo>
            </div>`,
        ),
};

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
            theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-800 text-gray-100',
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
            'block px-4 h-10 my-4 font-bold rounded-lg shadow text-2xs cursor-pointer transition-colors bg-gray-600 hover:bg-gray-500',
            className,
        )}
        onClick={onClick}
    >
        {children}
    </button>
);

const ThemeButton = ({ $value }: { $value: Observable<string> }) => {
    const theme = use$($value);
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
    const checked = use$($value);
    return (
        <div className="inline-flex items-center">
            <label className="relative flex items-center p-1 -m-1 rounded-full cursor-pointer">
                <input
                    type="checkbox"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-600 checked:bg-blue-600 checked:before:bg-blue-600 hover:before:opacity-10"
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
                    'relative z-10 bg-gray-800 text-white rounded-lg',
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
let timeout: NodeJS.Timeout;
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
    use$,
    useObservable,
    For,
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
    hideCode = false,
    hideDemo = false,
    showEditing = true,
    noInline = false,
    noError = false,
    disabled = false,
    previewCallout,
}: Props) {
    const trimmedCode = code.trim();
    const mergedScope = { ...defaultScope, ...scope };
    const [liveCode, setLiveCode] = useState(trimmedCode);

    // Get transform function by string key
    const transformFn = transformCode ? transformFunctions[transformCode] : undefined;

    return (
        <LiveProvider
            code={liveCode}
            transformCode={(output) => removeImports((transformFn ? transformFn(output) : output) + (renderCode || ''))}
            scope={mergedScope}
            enableTypeScript={true}
            theme={emptyTheme}
            disabled={disabled}
            noInline={noInline}
            language="tsx"
        >
            <div className="flex gap-4 text-sm mt-6 items-center">
                {!hideCode && (
                    <div className={classNames('relative flex-1', classNameEditor)}>
                        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto">
                            <div className="absolute inset-0 [&_pre]:pointer-events-none">
                                <DynamicCodeBlock lang="tsx" code={liveCode} />
                            </div>
                            <LiveEditor
                                style={{
                                    backgroundColor: 'transparent',
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    lineHeight: '1.45',
                                    outline: 'none',
                                    border: 'none',
                                    padding: 0,
                                    margin: 0,
                                    width: '100%',
                                    // minHeight: '200px',
                                    resize: 'vertical',
                                }}
                                onChange={(e) => {
                                    console.log(e);
                                    setLiveCode(e);
                                }}
                                className="liveEditor z-10 relative text-transparent caret-white mr-5! w-auto!"
                            />
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
                            'border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700',
                            name ? `preview-${name}` : 'col-span-1',
                            classNamePreview,
                        )}
                        style={{ width: previewWidth }}
                    >
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
