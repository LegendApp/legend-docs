import classNames from "classnames";
import { useAnimation, motion } from "framer-motion";
import React, { useEffect } from "react";
import { type ReactNode } from "react";

export function FlashingDiv({
  span,
  className,
  children,
}: {
  span?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const controls = useAnimation();

  useEffect(() => {
    controls
      .start({
        opacity: 0.2,
        transition: {
          duration: 0.1,
        },
      })
      .then(() => {
        controls.start({
          opacity: 0,
          transition: {
            duration: 0.2,
          },
        });
      });
  });

  return (
    <span className={classNames("relative", span ? "p-1" : "block p-1")}>
      <motion.div
        animate={controls}
        className="absolute inset-0 rounded-lg opacity-0 bg-blue-100"
      />
      <span
        className={classNames(
          "relative z-10",
          span ? "px-2 rounded-lg" : "block",
          className
        )}
      >
        {children}
      </span>
    </span>
  );
}
