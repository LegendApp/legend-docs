'use client';

import React, { useState } from "react";
import classNames from "classnames";
import { BiPencil } from "react-icons/bi";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

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
  return code.replace(/import .*?\n/g, "");
}

// Default scope with commonly used React elements and functions
const defaultScope = {
  React,
  useState,
  createElement: React.createElement,
  Fragment: React.Fragment,
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
  previewCallout
}: Props) {
  const trimmedCode = code.trim();
  const mergedScope = { ...defaultScope, ...scope };
  
  return (
    <LiveProvider
      code={trimmedCode}
      transformCode={(output) =>
        removeImports(
          (transformCode ? transformCode(output) : output) + (renderCode || "")
        )
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
          <div className={classNames("relative flex-1", classNameEditor)}>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto">
              <LiveEditor 
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: '1.5',
                  outline: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  width: '100%',
                  minHeight: '200px',
                  resize: 'vertical',
                }}
              />
            </div>
            {showEditing && (
              <div
                className={classNames(
                  "absolute top-3 right-3 !mt-0 flex items-center bg-blue-600 text-white px-2 py-1 rounded-md text-xs cursor-default shadow-md"
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
              "border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700",
              name ? `preview-${name}` : "col-span-1",
              classNamePreview
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