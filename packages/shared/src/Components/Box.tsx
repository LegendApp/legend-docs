import classNames from "classnames";

export const Box = ({
  className,
  theme,
  children,
  width,
  height,
  center
}: {
  className?: string;
  theme?: "light" | "dark";
  center?: boolean;
  children: any;
  width?: number;
  height?: number;
}) => {
  return (
    <div
      className={classNames(
        "rounded-lg p-4 relative",
        center && "flex flex-col items-center",
        theme === "light"
          ? "bg-gray-50 text-gray-900"
          : "bg-gray-800 text-gray-100",
        className
      )}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};
