import { Header } from "./Header";
import { List } from "./List";
import { Text } from "./Text";

export function SectionKitComponents() {
  return (
    <div className="mt-subsection px-4">
      <Header size="h3">📚 Library of helpful code</Header>
      <Text className="max-w-4xl">
        High performance headless components, helpful generic observables and transformational computed observables, React hooks that return observables (so they don't re-render), and observable tools for popular frameworks.
      </Text>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <List
          title="Optimized Components"
          items={["Tabs", "Modals", "Forms", "Toasts", "More..."]}
          border
        />
        <List
          title="Observable helpers"
          items={[
            "currentDate",
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
