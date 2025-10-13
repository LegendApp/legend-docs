import classNames from 'classnames';
import { useAnimation, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { type ReactNode } from 'react';

export function FlashingDiv({
    span,
    className,
    classNameOuter,
    bg,
    pad,
    children,
}: {
    span?: boolean;
    className?: string;
    classNameOuter?: string;
    bg?: string;
    pad?: boolean;
    children: ReactNode;
}) {
    const controls = useAnimation();

    useEffect(() => {
        controls
            .start({
                opacity: 0.2,
                transition: {
                    duration: 0.1,
                },
            })
            .then(() => {
                controls.start({
                    opacity: 0,
                    transition: {
                        duration: 0.2,
                    },
                });
            });
    });

    return (
        <span className={classNames('relative', span ? 'p-1' : 'block p-1', classNameOuter)}>
            <motion.div animate={controls} className="absolute inset-0 rounded-lg opacity-0 bg-sky-500" />
            <span
                className={classNames(
                    'relative z-10 rounded-lg',
                    bg || 'bg-fd-card',
                    pad && 'p-4',
                    span ? 'px-2' : 'block',
                    className,
                )}
            >
                {children}
            </span>
        </span>
    );
}
