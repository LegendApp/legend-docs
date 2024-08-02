import classNames from "classnames";

interface Props {
  badges: { title: string; subtitle?: string }[];
  titleSize?: `text-${string}`;
  titleWeight?: `font-${string}`;
}

export const Badges = ({ badges, titleSize, titleWeight }: Props) => {
  return (
    <div className="flex justify-center mt-16">
      <div className="flex justify-center border border-white/15 rounded-lg divide-x divide-white/15 shadow-dark">
        {badges.map(({ title, subtitle}) => (
          <div key={title} className="!mt-0 px-8 py-2 text-center">
            <div className={classNames("text-white",titleSize || 'text-lg', titleWeight || 'font-bold' )}>{title}</div>
            {subtitle && <div className="text-md text-white/80 pt-1 !mt-0">{subtitle}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};
