import classNames from "classnames";

export const Box = ({
  className,
  theme,
  children,
  width
}: {
  className?: string;
  theme?: "light" | "dark";
  children: any;
  width?: number;
}) => {
  return (
    <div
      className={classNames(
        "rounded-lg p-4 flex flex-col items-center",
        theme === "light" ? "bg-gray-50 text-gray-900" : "bg-gray-800",
        className
      )}
      style={{ width }}
    >
      {children}
    </div>
  );
};
