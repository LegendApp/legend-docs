import { createElement, type ReactNode } from 'react';
import classNames from 'classnames';

interface Props {
    children: ReactNode;
    size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    className?: string;
    fontWeight?: string;
    leading?: string;
    color?: `${'!' | ''}text-${string}`;
}

export function Header({ children, color, size, className, leading, fontWeight }: Props) {
    return createElement(
        size,
        {
            className: classNames(
                color || 'text-white',
                leading || '!leading-normal',
                fontWeight || 'font-bold',
                size === 'h1'
                    ? 'text-4xl sm:text-5xl'
                    : size === 'h2'
                      ? 'text-3xl sm:text-4xl'
                      : size === 'h3'
                        ? 'text-2xl sm:text-3xl'
                        : size === 'h4'
                          ? 'text-xl sm:text-2xl'
                          : size === 'h5'
                            ? 'text-lg sm:text-xl'
                            : size === 'h6'
                              ? 'text-base sm:text-lg'
                              : '',
                className,
            ),
        },
        children,
    );
}
