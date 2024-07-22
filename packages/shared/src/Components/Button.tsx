import classNames from "classnames";

export const Button = ({
  onClick,
  theme,
  children,
  className
}: {
  theme: "light" | "dark";
  onClick: () => void;
  className?: string;
  children: any;
}) => {
  return (
    <button
      className={classNames(
        "block px-4 py-2 my-4 font-bold rounded shadow text-2xs cursor-pointer bg-gray-600 hover:bg-gray-500",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
