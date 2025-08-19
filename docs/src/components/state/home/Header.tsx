import { createElement, type ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  fontWeight?: string;
  leading?: string;
  color?: `${'!' | ''}text-${string}`;
}

export function Header({
  children,
  color,
  size,
  className,
  leading,
  fontWeight,
}: Props) {
  return createElement(
    size,
    {
      className: classNames(
        color || "text-white",
        leading || "!leading-normal",
        fontWeight || "font-bold",
        className,
      ),
    },
    children
  );
}