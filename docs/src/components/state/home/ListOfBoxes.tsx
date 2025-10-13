import classNames from "classnames";

interface Props {
  items: string[];
  itemSize?: `text-${string}`;
  itemWeight?: `font-${string}`;
  className?: string;
}

export const ListOfBoxes = ({
  items,
  itemSize,
  itemWeight,
  className,
}: Props) => {
  return (
    <div className={classNames("flex mt-16", className)}>
      <div className="flex flex-wrap gap-2 max-w-3xl">
        {items.map((item) => (
          <div
            key={item}
            className="!mt-0 px-8 py-2 text-center whitespace-pre bg-tBgLight rounded-lg"
          >
            <div
              className={classNames(
                "text-white",
                itemSize,
                itemWeight
              )}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};