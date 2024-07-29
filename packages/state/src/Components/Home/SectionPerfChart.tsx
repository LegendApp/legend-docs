import classNames from "classnames";
import { SectionTitle } from "./Components";
import { motion, useInView, type Transition } from "framer-motion";
import { useRef } from "react";
import { useObservable } from "@legendapp/state/react";

export const SectionRPerfChart = () => {
  const TransitionSpringFast: Transition = {
    type: "spring",
    duration: 1,
    bounce: 0.3,
  };
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const chartData = [
    { name: "Legend-State", value: 1.02 },
    { name: "Jotai", value: 1.41 },
    { name: "MobX", value: 1.49 },
    { name: "Recoil", value: 1.53 },
    { name: "Redux", value: 1.55 },
    { name: "Zustand", value: 1.69 },
    { name: "Valtio", value: 1.82 },
  ];

  const minValue = 0.85;
  const maxValue = 1;

  return (
    <div className="!mt-20 max-w-4xl mx-auto" ref={ref}>
      <SectionTitle
        text="🚀 The fastest React state library"
        description="Legend-State is so fast that it outperforms even vanilla JS in some benchmarks. Extremely optimized at just 4kb and encouraging fine-grained reactivity, it reduces code and file size while maximizing performance."
      />
      <div className="mt-8 max-w-lg">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center [&>*]:!mt-0">
            <div className="w-28 flex-shrink-0 text-right mr-4">
              {item.name}
            </div>
            <div className="flex-1 text-sm" /*bg-gray-700 rounded-full */>
              <motion.div
                className={classNames(
                  "h-6 rounded-full relative text-right flex items-center justify-end font-medium"
                )}
                initial={{ width: 0, opacity: 0 }}
                animate={
                  inView
                    ? {
                        width: `${((item.value - minValue) / maxValue) * 100}%`,
                        opacity: 1,
                      }
                    : {}
                }
                transition={{
                  width: {
                    ...TransitionSpringFast,
                    delay: index * 0.1,
                  },
                  opacity: {
                    duration: 0.5,
                    delay: index * 0.1,
                  },
                }}
              >
                <motion.div
                  className={classNames(
                    "h-6 rounded-full absolute inset-0 text-right flex items-center justify-end font-medium",
                    index === 0 ? "bg-blue-500" : "bg-gray-500"
                  )}
                  whileHover={{
                    backgroundColor: index === 0 ? "#1eb5f9" : "#888899",
                    scaleY: 1.2,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                />
                <motion.span className="pr-2 z-10 pointer-events-none" layout>
                  {item.value}
                </motion.span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
