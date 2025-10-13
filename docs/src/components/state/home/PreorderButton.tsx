import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Button } from './Button';

interface PreorderButtonProps {
    color: 'white' | 'gradient';
    className?: string;
    children: ReactNode;
}

export function PreorderButton({ color, className, children }: PreorderButtonProps) {
    // For FumaDocs, we'll use a placeholder link for now
    const paymentLink = 'https://buy.stripe.com/4gw03ZgJle3V0zS288';

    return (
        <a href={paymentLink} target="_blank" className='no-underline'>
            <Button
                color={classNames(
                    'font-semibold',
                    color === 'white' && 'bg-white hover:bg-white/70 text-black/90 shadow-md',
                    color === 'gradient' &&
                        'bg-gradient-to-br from-[#d556e3] to-[#3c59fd] hover:from-[#dd70e7] hover:to-[#5370fd] text-white/90',
                )}
                className={className}
            >
                {children}
            </Button>
        </a>
    );
}