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
      className={
        "rounded-lg p-4 relative bg-black/50 text-gray-200 backdrop-blur-sm border t-border shadow-dark"
      }
      style={{ width, height }}
    >
      {children}
    </div>
  );
};