import classNames from "classnames";

export const Button = ({
  onClick,
  className,
  color,
  children,
}: {
  onClick?: () => void;
  className?: string;
  color?: string;
  children: any;
}) => {

  return (
    <button
      className={classNames(
        "block px-4 h-10 my-4 font-bold rounded-lg shadow text-2xs cursor-pointer transition-colors",
        color || 'bg-gray-600 hover:bg-gray-500',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
