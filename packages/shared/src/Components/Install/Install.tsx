import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { observer } from "@legendapp/state/react";
import { syncObservable } from "@legendapp/state/sync";
import classNames from "classnames";
import { state$, type PackageManager } from "../../state";
import { Tabs } from "../Tabs";

const tabs: PackageManager[] = ["bun", "npm", "yarn", "pnpm"];

syncObservable(state$, {
    persist: {
        plugin: ObservablePersistLocalStorage,
      name: "state",
    },
  })

export const InstallTabs = observer(function ({ name }: { name: string }) {
  return <Tabs name={name} tabs={tabs} activeTab$={state$.packageManager} />;
});

export const InstallCode = observer(function ({ name }: { name: string }) {
  const manager = state$.packageManager.get();

  return (
    <pre
      className="!mt-4 astro-code css-variables"
      style={{
        backgroundColor: "var(--astro-code-color-background)",
        overflowX: "auto",
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
  );
});

export const Install = observer(function ({
  name,
  className,
  uid,
}: {
  name: string;
  className?: string;
  uid?: string;
}) {
  return (
    <div className={classNames("mt-6", className)}>
      <InstallTabs name={name || uid!} />
      <InstallCode name={name} />
    </div>
  );
});
