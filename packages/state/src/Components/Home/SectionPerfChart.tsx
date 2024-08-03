import classNames from "classnames";
import { SectionTitle } from "./Components";
import { motion, useInView, type Transition } from "framer-motion";
import { useRef } from "react";
import { useObservable } from "@legendapp/state/react";
import { Header } from "./Header";
import { Text } from "./Text";

export const SectionPerfChart = () => {
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

  const minValue = 0.8;
  const maxValue = 1;

  return (
    <div className="mt-section gap-8 grid grid-cols-2" ref={ref}>
      <div>
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center [&>*]:!mt-0">
            <div className="w-28 flex-shrink-0 text-right mr-4">
              {item.name}
            </div>
            <div className="flex-1 text-sm">
              <motion.div
                className={classNames(
                  "h-7 rounded-full relative text-right flex items-center justify-end font-medium"
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
                    "h-7 rounded-full absolute inset-0 text-right flex items-center justify-end font-medium"
                  )}
                  style={{
                    backgroundColor: index === 0 ? "#0284c7" : "#DDEEFF25",
                  }}
                  whileHover={{
                    backgroundColor: index === 0 ? "#1eb5f9" : "#DDEEFF50",
                    scaleY: 1.2,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                />
                <motion.span className="pr-3 z-10 pointer-events-none" layout>
                  {item.value}
                </motion.span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      <div className="-ml-16">
        <Header size="h2">🚀 The fastest React state library</Header>
        <Text className="pt-4 max-w-md">
          Legend-State is so fast that it even outperforms vanilla JS in some{" "}
          <a href="https://krausest.github.io/js-framework-benchmark/">
            benchmarks
          </a>
          . It's extremely optimized with fine-grained reactivity and massively
          reduces re-rendering.
        </Text>
      </div>
    </div>
  );
};
