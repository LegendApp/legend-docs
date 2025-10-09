import { useState, useEffect } from 'react';
import type React from 'react';

export const ExampleAnim = ({
    width,
    noValue,
    time,
    className,
    children,
}: {
    width: number;
    noValue?: boolean;
    time?: number;
    className?: string;
    children: (value: number) => React.ReactElement;
}) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setValue((v) => (v === 0 ? 1 : 0));
        }, time || 1000);

        return () => clearInterval(interval);
    }, [time]);

    return (
        <div
            className={`flex flex-col px-6 justify-center ${!noValue ? 'mt-10' : ''} ${className || ''}`}
            style={{ width }}
        >
            {children(value)}
            {!noValue && (
                <div className="flex justify-center pt-6 font-medium">
                    <div>value:</div>
                    <div className="w-3 pl-2 font-bold text-blue-500">{value}</div>
                </div>
            )}
        </div>
    );
};
