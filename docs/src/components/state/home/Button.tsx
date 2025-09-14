import classNames from 'classnames';

export const Button = ({
    onClick,
    className,
    color,
    children,
}: {
    onClick?: () => void;
    className?: string;
    color?: string;
    children: React.ReactNode;
}) => {
    return (
        <button
            className={classNames(
                'block px-4 h-10 my-4 font-bold rounded-lg shadow cursor-pointer transition-colors',
                color || 'bg-zinc-600 hover:bg-zinc-500',
                className,
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
