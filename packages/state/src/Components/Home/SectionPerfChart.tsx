import classNames from "classnames";
import { SectionTitle } from "./Components";
import { motion, useInView, type Transition } from "framer-motion";
import { useRef } from "react";

export const SectionRPerfChart = () => {
  const TransitionSpringFast: Transition = {
    type: "spring",
    duration: 1,
    bounce: 0.3,
  };
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const chartData = [
    { name: "Vanilla JS", value: 1 },
    { name: "Legend-State", value: 1.1 },
    { name: "Test", value: 1.4 },
    { name: "Test2", value: 1.6 },
    { name: "Context API", value: 1.8 },
  ];

  const minValue = 0.8;
  const maxValue = 1.2;

  return (
    <div className="!mt-20 max-w-4xl mx-auto" ref={ref}>
      <SectionTitle
        text="🚀 The fastest React state library"
        description="Legend-State is so fast that it outperforms even vanilla JS in some benchmarks. Extremely optimized at just 4kb and encouraging fine-grained reactivity, it reduces code and file size while maximizing performance."
      />
      <div className="mt-8 max-w-lg">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center mb-4">
            <div className="w-24 text-right mr-4">{item.name}</div>
            <div className="flex-grow bg-gray-700 rounded-full h-6 overflow-hidden">
              <motion.div
                className={classNames(
                  "h-full rounded-full",
                  index === 1 ? "bg-blue-500" : "bg-gray-500"
                )}
                initial={{ width: 0 }}
                animate={
                  inView
                    ? {
                        width: `${((item.value - minValue) / maxValue) * 100}%`,
                      }
                    : {}
                }
                transition={{ ...TransitionSpringFast, delay: index * 0.2 }}
              ></motion.div>
            </div>
            <div className="w-12 text-left ml-4">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
