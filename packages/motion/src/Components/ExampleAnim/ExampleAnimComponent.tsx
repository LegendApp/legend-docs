import { useInterval } from "@legendapp/tools/react";
import classNames from "classnames";
import { useState } from "react";

export const ExampleAnim = ({
  width,
  noValue,
  time,
  children,
}: {
  width: number;
  noValue?: boolean;
  time?: number;
  children: (value: number) => JSX.Element;
}) => {
  const [value, setValue] = useState(0);
  useInterval(() => setValue((v) => (v === 0 ? 1 : 0)), time || 1000);
  return (
    <div
      className={classNames(
        "flex flex-col justify-center",
        !noValue && "mt-10"
      )}
      style={{ width }}
    >
      {children(value)}
      {!noValue && (
        <div className="flex justify-center pt-6 font-medium">
          <div>value:</div>
          <div className="w-3 pl-2 font-bold text-blue-accent">{value}</div>
        </div>
      )}
    </div>
  );
};
