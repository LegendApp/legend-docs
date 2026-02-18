Legend List runs natively on the web with DOM elements. You do **not** need React Native or react-native-web to use it.

- ⚡️ Virtualized, fast scrolling lists in React
- 🧠 Dynamic item sizes
- 🧩 Same API as the React Native version

<Callout>
Looking for the React Native version? Start with <a href="../../react-native/getting-started">Getting Started (React Native)</a>.
</Callout>

## Install

```npm
npm install @legendapp/list
```

## Usage

On web, `renderItem` should return DOM elements (e.g. `div`). Your list needs a height, either directly or via a parent with a fixed height.

```jsx
import { LegendList } from "@legendapp/list/react";

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

export function WebList() {
  return (
    <div style={{ height: 480, border: "1px solid #e5e7eb" }}>
      <LegendList
        data={items}
        keyExtractor={(item) => item.id}
        estimatedItemSize={44}
        renderItem={({ item }) => (
          <div style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
            {item.title}
          </div>
        )}
        style={{ height: "100%" }}
      />
    </div>
  );
}
```

### Important layout notes

- The scroll container must have a height. Use a fixed height, or a flex parent with a set height.
- `style` and `contentContainerStyle` accept CSS properties on web.
- If you are rendering inside a flex layout, be sure the list can actually shrink (e.g. `minHeight: 0` on the parent).

### TypeScript note

Legend List’s types reference `react-native` for shared types. If your TS setup complains about missing `react-native` types, add `react-native` as a dev dependency or provide a minimal module stub.

See [API Reference](../../api) for the shared API and platform-specific callouts.
