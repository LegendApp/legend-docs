import { observable, type Observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import classNames from "classnames";
import { motion, type Transition } from "framer-motion";

interface PropsTab<T extends string> {
  name: string;
  layoutId: string;
  text?: string;
  activeTab$: Observable<T>;
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

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
const tabs: PackageManager[] = ["bun", "npm", "yarn", "pnpm"];

export const state$ = observable({
  packageManager: "npm" as PackageManager,
  exampleCount: 0,
  exampleTheme: "light",
});

if (typeof window !== "undefined") {
  configureObservablePersistence({
    pluginLocal: ObservablePersistLocalStorage,
  });
  persistObservable(state$, {
    local: "state",
  });
}

const Tab = observer(function Tab<T extends string>({ name, layoutId, text, activeTab$ }: PropsTab<T>) {
  const isActive = name === activeTab$.get();
  return (
    <div
      className="relative px-1 pb-1 mx-2 !mt-0 cursor-pointer "
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

export const Install = observer(function ({
  name,
  className,
  uid,
}: {
  name: string;
  className?: string;
  uid?: string;
}) {
  const manager = state$.packageManager.get();

  return (
    <div className={classNames("mt-6", className)}>
      <Tabs
        name={name + (uid || "")}
        tabs={tabs}
        activeTab$={state$.packageManager}
      />
      <pre
        className="!mt-4 astro-code css-variables"
        style={{
          "backgroundColor": "var(--astro-code-color-background)",
          "overflowX": "auto",
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
});
