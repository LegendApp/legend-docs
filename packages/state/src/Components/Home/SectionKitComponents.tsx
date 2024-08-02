import { Header } from "./Header";
import { List } from "./List";

export function SectionKitComponents() {
  return (
    <div>
        <Header size="h3">1. Library of helpful code</Header>
      <div className="grid grid-cols-4 gap-2">
        <List
          title="Optimized Components"
          items={["Tabs", "Modals", "Forms", "Toasts", "More..."]}
          border
        />
        <List
          title="Observable helpers"
          items={[
            "Current date & time",
            "createDraft",
            "stringAsNumber",
            "setAsString",
            "More...",
          ]}
          border
        />
        <List
          title="React hooks"
          items={[
            "useMeasure",
            "usePosition",
            "useScrolled",
            "useHover",
            "More...",
          ]}
          border
        />
        <List
          title="Framework hooks"
          items={[
            "useRoutes",
            "useRouteHistory",
            "useCanRender",
            "usePauseProvider",
            "More...",
          ]}
          border
        />
      </div>
    </div>
  );
}
