import { createElement, type ReactNode } from "react";
import classNames from "classnames";

interface Props {
    children: ReactNode;
    size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    className?: string;
    fontWeight?: string;
    leading?: string;
}

export function Header({ children, size, className, leading, fontWeight }: Props) {
    return createElement(
      size,
      {
        className: classNames("text-white", className, leading || '!leading-normal', fontWeight || "font-bold"),
      },
      children
    );
}