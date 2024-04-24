import { observer } from "@legendapp/state/react";
import classNames from "classnames";
import { state$ } from "shared/src/state";
import { Tabs } from "../Tabs";
import {ReactOrNativeCode} from "../ReactOrNativeCode/ReactOrNativeCode";

export const SelectFramework = observer(function ({
  className,
  onlyFirst
}: {
  className?: string;
  onlyFirst?: string
}) {
  const tabs = ['React', 'React Native'];

  return (
    <div className={classNames("mt-6", className)}>
      <Tabs
        name={'SelectFramework'}
        tabs={tabs}
        activeTab$={state$.framework}
      />
      <ReactOrNativeCode onlyFirst={onlyFirst} />
    </div>
  );
});
