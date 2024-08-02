import { computeSelector, isObservable, type Observable } from "@legendapp/state";
import { observer, useObservable } from "@legendapp/state/react";
import cx from "classnames";
import { motion, type Transition } from "framer-motion";
import { useMemo, useRef } from "react";
import { type PositionSize, useElementPosition } from "./usePosition";

let tabGroupNameNext = 0;

const TransitionSpringFast: Transition = {
  type: "spring",
  duration: 0.35,
  bounce: 0.25,
};


interface PropsTab {
  name: string;
  groupName: string;
  text?: string;
  disabled?: boolean;
  activeTab: string;
  $activeTab: Observable<string>;
  defaultTab: string;
  tabPadding: `pb-${number}`;
  setActiveTab: (value: string) => void;
  numVariant?: "default" | "red";
  numValue?: number | string;
  index: number;
  tabPosition$: Observable<PositionSize>;
}
const Tab = observer(function Tab({
  name,
  groupName,
  text,
  tabPadding,
  disabled,
  activeTab,
  $activeTab,
  defaultTab,
  setActiveTab,
  numVariant = "default",
  numValue,
  index,
  tabPosition$,
}: PropsTab) {
  const ref = useRef<HTMLDivElement>();
  // const size$ = useMeasure(ref);
  const pos$ = useElementPosition(ref, groupName);
  useMemo(() => tabPosition$.set(pos$), [index]);

  const isActive = name === (activeTab || defaultTab);

  return (
    <motion.div
      className={cx(
        "relative cursor-pointer select-none !my-0 px-1",
        name,
        tabPadding,
        disabled && "pointer-events-none opacity-30"
      )}
      onClick={() => {
        isObservable($activeTab) ? $activeTab.set(name) : setActiveTab(name);
      }}
      layout
      layoutRoot
      ref={ref}
    >
      <div className="flex items-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        <div
          className={cx(
            "flex items-center whitespace-nowrap",
            isActive && "text-tPurpleHover"
          )}
        >
          <div data-text={text} className="whitespace-pre">
            {text}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

interface Props<T extends string> {
  tabs: readonly T[];
  tabTexts?: Record<T, string>;
  tabText?: (tab: T) => string;
  activeTab?: T;
  $activeTab?: Observable<T>;
  defaultTab?: T;
  className?: string;
  tabPadding: `pb-${number}`;
  onSelect?: (tab: T) => void;
  numVariant?: Record<T, "default" | "red">;
  listsForNum?: Record<any, any[]>;
}

export const TabsUnderlined = observer(function TabsUnderlined<
  T extends string
>({
  tabs,
  tabTexts,
  tabText,
  activeTab,
  $activeTab,
  defaultTab,
  tabPadding,
  className,
  onSelect,
  numVariant,
  listsForNum,
}: Props<T>) {
  const groupName = useMemo(() => "Tabs" + tabGroupNameNext++, []);
  // Detect being on a tab that's no longer in the `tabs` prop and redirect to the default
  if ($activeTab && defaultTab && isObservable($activeTab)) {
    const active = computeSelector($activeTab) as T;
    if (active && !tabs.includes(active)) {
      setTimeout(() => {
        $activeTab.set(defaultTab);
      }, 0);
    }
  }

  if (!activeTab && $activeTab) {
    activeTab = $activeTab.get();
  }

  // Create a tabWidths observable for each tab to measure itself and fill it out
  const tabPositions$ = useObservable<Record<string, PositionSize>>({});
  const tabPositions = tabPositions$.get();

  const tabIndex = tabs.indexOf(activeTab || defaultTab as any);

  const defaultHeight = 32;
  const underlineAnimate: { x: number; y: number; width: number } =
    tabIndex >= 0
      ? {
          x: tabPositions[activeTab as string]?.left || 0,
          y: (tabPositions[activeTab as string]?.bottom || defaultHeight) - 2,
          width: tabPositions[activeTab as string]?.width || 80,
        }
      : { x: 0, y: defaultHeight, width: 0 };

  // Render
  return (
    <nav
      className={cx(
        "relative flex flex-wrap gap-x-4 gap-y-2 pr-8 text-sm pb-4",
        className
      )}
    >
      {tabs.map((tab, i) => (
        <Tab
          key={tab}
          groupName={groupName}
          name={tab}
          text={tabTexts?.[tab] || tabText?.(tab) || tab}
          tabPadding={tabPadding}
          activeTab={activeTab as string}
          $activeTab={$activeTab as unknown as Observable<string>}
          defaultTab={defaultTab as string}
          setActiveTab={onSelect as any}
          numVariant={numVariant?.[tab]}
          numValue={listsForNum?.[tab]?.length}
          index={i}
          tabPosition$={tabPositions$[tab]}
        />
      ))}
      <motion.div
        initial={underlineAnimate}
        animate={underlineAnimate}
        className="absolute top-0 h-0.5 bg-blue-500 !mt-0"
        transition={TransitionSpringFast}
      />
    </nav>
  );
});
