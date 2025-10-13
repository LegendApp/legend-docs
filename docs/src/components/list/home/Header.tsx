import { createElement, type ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
  size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  className?: string;
}

export function Header({ children, size, className }: Props) {
  return createElement(
    size,
    {
      className: classNames("text-white font-bold", className),
    },
    children
  );
}