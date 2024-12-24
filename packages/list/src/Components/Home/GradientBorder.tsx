import classNames from "classnames";
import type { ReactNode } from "react";

export function GradientBorder({ children, className, style }: { children: ReactNode, className?: string, style?: CSSProperties }) {
  return (
    <div className={classNames("grad-stroke", className)} style={style}>
      {children}
      <div className="gs" />
    </div>
  );
}
