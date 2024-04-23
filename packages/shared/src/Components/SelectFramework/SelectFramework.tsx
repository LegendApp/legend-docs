import { observer } from "@legendapp/state/react";
import classNames from "classnames";
import { state$ } from "shared/src/state";
import { Tabs } from "../Tabs";

export const SelectFramework = observer(function ({
  name,
  className,
  uid,
}: {
  name: string;
  className?: string;
  uid?: string;
}) {
  const framework = state$.framework.get();
  const tabs = ['React', 'React Native']

  return (
    <div className={classNames("mt-6", className)}>
      <Tabs
        name={name + (uid || "")}
        tabs={tabs}
        activeTab$={state$.framework}
      />
    </div>
  );
});
