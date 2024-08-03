import classNames from "classnames";

interface Props {
  badges: { title: string; subtitle?: string }[];
  titleSize?: `text-${string}`;
  titleWeight?: `font-${string}`;
  className?: string;
}

export const Badges = ({ badges, titleSize, titleWeight, className }: Props) => {
  return (
    <div className={classNames("flex justify-center", className)}>
      <div className="flex justify-center border t-bg t-border rounded-lg divide-x t-divide shadow-dark">
        {badges.map(({ title, subtitle }) => (
          <div key={title} className="!mt-0 px-8 py-2 text-center whitespace-pre">
            <div
              className={classNames(
                "text-white",
                titleSize || "text-lg",
                titleWeight || "font-bold"
              )}
            >
              {title}
            </div>
            {subtitle && (
              <div className="text-md text-white/80 pt-1 !mt-0">{subtitle}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
