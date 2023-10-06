import { observable, type Observable } from "@legendapp/state";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import classNames from "classnames";
import { motion, type Transition } from "framer-motion";

interface PropsTab {
  name: string;
  layoutId: string;
  text?: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
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
  activeTab$: Observable<T>;
  className?: string;
}

const tabs: PackageManager[] = ["npm", "yarn", "pnpm", "bun"];

enableReactUse();
export const state = observable({
  packageManager: "npm" as PackageManager,
  exampleCount: 0,
  exampleTheme: "light",
});

if (typeof window !== "undefined") {
  configureObservablePersistence({
    persistLocal: ObservablePersistLocalStorage,
  });
  persistObservable(state, {
    local: "state",
  });
}

const Tab = function ({
  name,
  layoutId,
  text,
  activeTab,
  setActiveTab,
}: PropsTab) {
  const isActive = name === activeTab;
  return (
    <div
      className="relative px-1 pb-1 mx-2 !mt-0 cursor-pointer "
      onClick={() => setActiveTab(name)}
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
};

export const Tabs = function <T extends string>({
  name,
  tabs,
  tabTexts,
  activeTab$,
  className,
}: Props<T>) {
  const activeTab = activeTab$.use() || tabs[0];

  return (
    <motion.div className={classNames("flex items-center", className)} layout>
      {tabs.map((tab, i) => (
        <Tab
          layoutId={name}
          key={tab}
          name={tab}
          text={tabTexts?.[i] || tab}
          activeTab={activeTab}
          setActiveTab={activeTab$.set as (tab: T) => void}
        />
      ))}
    </motion.div>
  );
};

export const Install = function ({
  name,
  className,
  uid,
}: {
  name: string;
  className?: string;
  uid?: string;
}) {
  const manager = state.packageManager.use();

  return (
    <div className={classNames("mt-6", className)}>
      <Tabs
        name={name + (uid || "")}
        tabs={tabs}
        activeTab$={state.packageManager}
      />
      <pre
        className="!mt-4 astro-code css-variables"
        style={{
          "background-color": "var(--astro-code-color-background)",
          "overflow-x": "auto",
        }}
      >
        <code className="language-bash code-highlight">
          <span className="code-line">
            <span className="token function">{manager}</span>{" "}
            <span className="token function">
              {manager === "npm" ? "i" : "add"}
            </span>
            {" " + name}
          </span>
        </code>
      </pre>
    </div>
  );
};
