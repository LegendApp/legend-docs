import { createElement, type ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode;
  type?: 'p';
  className?: string;
  fontWeight?: string;
  leading?: string;
}

export function Text({ children, type, className, fontWeight, leading }: Props) {
  return createElement(
    type || 'p',
    {
      className: classNames("text-white/70", className, fontWeight || "font-medium", leading || 'leading-normal'),
    },
    children
  );
}