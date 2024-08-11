import classNames from "classnames";

export const SectionTitle = ({
  text,
  description,
}: {
  text: string;
  description: string;
}) => {
  return (
    <div className="mx-auto grid grid-cols-2 gap-16">
      <h2 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
        {text}
      </h2>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-400">
        {description}
      </p>
    </div>
  );
};

export const DemoBox = ({
  children,
  width,
  height,
  blur,
}: {
  children: any;
  width?: number;
  height?: number;
  blur?: boolean;
}) => {
  return (
    <div
      className={classNames(
        "rounded-lg p-4 relative text-gray-200 border border-tBorder shadow-tShadowDark",
        blur && "backdrop-blur-sm bg-black/20"
      )}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};
