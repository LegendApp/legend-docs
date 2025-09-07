import classNames from 'classnames';
import { type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    color?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
    href?: string;
    onClick?: () => void;
}

export function Button({ children, color, size = 'medium', className, href, onClick }: Props) {
    const baseClasses =
        'font-semibold rounded-lg transition-colors duration-200 no-underline inline-flex items-center justify-center cursor-pointer';

    const sizeClasses = {
        small: 'px-3 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    };

    const classes = classNames(
        baseClasses,
        sizeClasses[size],
        color || 'bg-blue-600 hover:bg-blue-700 text-white',
        className,
    );

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    );
}
