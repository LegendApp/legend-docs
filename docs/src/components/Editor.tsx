'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import { BiPencil } from 'react-icons/bi';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { observable } from '@legendapp/state';
import { use$, useObservable, For } from '@legendapp/state/react';
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
    transformCode?: (code: string) => string;
    previewCallout?: React.ReactNode;
}

const emptyTheme = { plain: {}, styles: [] };

function removeImports(code: string) {
    return code.replace(/import .*?\n/g, '');
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
            'rounded-lg p-2 relative max-w-sm',
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

// Default scope with commonly used React elements and Legend-State functions
const defaultScope = {
    React,
    useState,
    createElement: React.createElement,
    Fragment: React.Fragment,
    // Legend-State functions
    observable,
    use$,
    useObservable,
    For,
    // UI Components
    Box,
    Button,
    ThemeButton,
    Checkbox,
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

    return (
        <LiveProvider
            code={liveCode}
            transformCode={(output) =>
                removeImports((transformCode ? transformCode(output) : output) + (renderCode || ''))
            }
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
                            'border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700',
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
