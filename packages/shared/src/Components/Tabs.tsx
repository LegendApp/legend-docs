import { type ObservableParam } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import classNames from "classnames";
import { motion, type Transition } from "framer-motion";

interface PropsTab<T extends string> {
  name: string;
  layoutId: string;
  text?: string;
  activeTab$: ObservableParam<T>;
}
const TransitionTab: Transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.21,
};

interface Props<T extends string> {
  name: string;
  tabs: T[];
  tabTexts?: string[];
  activeTab$: ObservableParam<T>;
  className?: string;
}

const Tab = observer(function Tab<T extends string>({
  name,
  layoutId,
  text,
  activeTab$,
}: PropsTab<T>) {
  const isActive = name === activeTab$.get();
  return (
    <div
      className="relative px-1 pb-1 mx-2 !mt-0 cursor-pointer"
      onClick={() => activeTab$.set(name)}
    >
      <div
        data-text={text}
        className={classNames(
          "bold-consistent-width",
          isActive && "text-blue-accent font-bold"
        )}
      >
        {text}
      </div>
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-x-0 bottom-0 h-1 rounded bg-blue-accent"
          transition={TransitionTab}
        />
      )}
    </div>
  );
});

export const Tabs = function <T extends string>({
  name,
  tabs,
  tabTexts,
  activeTab$,
  className,
}: Props<T>) {
  return (
    <motion.div className={classNames("flex items-center", className)} layout>
      {tabs.map((tab, i) => (
        <Tab
          layoutId={name}
          key={tab}
          name={tab}
          text={tabTexts?.[i] || tab}
          activeTab$={activeTab$}
        />
      ))}
    </motion.div>
  );
};
