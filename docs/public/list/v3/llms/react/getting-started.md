## Install

```npm
npm install @legendapp/list
```

## Usage

Legend List is a drop-in replacement for virtualized lists in React. It only renders the items that are in view, which significantly reduces render cost for long lists.

This guide is for React apps rendered with `react-dom`. Use `@legendapp/list/react` for a DOM-native list with no React Native components or dependencies.

<Callout title="Using React Native Web?">
If your app uses React Native Web, follow [Getting Started (React Native)](../../react-native/getting-started) instead and use the React Native entrypoint.
</Callout>

Your list needs a height, either directly or via a parent with a fixed height.

### Quick Start

```jsx
import { LegendList } from "@legendapp/list/react";

const items = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
];

export function MyList() {
  return (
    <div style={{ height: 480, border: "1px solid #e5e7eb" }}>
      <LegendList
        data={items}
        renderItem={({ item }) => (
          <div style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
            {item.title}
          </div>
        )}
        keyExtractor={(item) => item.id}
        recycleItems
        style={{ height: "100%" }}
      />
    </div>
  );
}
```

### Window Scroll Pages

If your page already scrolls at the window level (instead of a fixed-height list container), set `useWindowScroll`.

```jsx
<LegendList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  useWindowScroll
/>
```

### Important layout notes

- The scroll container must have a height (unless you use `useWindowScroll`). Use a fixed height, or a flex parent with a set height.
- `style` and `contentContainerStyle` accept CSS properties on web.
- If you are rendering inside a flex layout, be sure the list can actually shrink (e.g. `minHeight: 0` on the parent).

See [API Reference](../../api) for all properties of LegendList.

## Supported Platforms

- Chrome
- Safari
- Firefox
- Edge
- Any modern browser with current React support

## Community

Join us on [Discord](https://discord.gg/5CBaNtADNX) or [Github](https://github.com/LegendApp/legend-list) to get involved with the Legend community.

Talk to Jay on [Bluesky](https://bsky.app/profile/jayz.us) or [Twitter](https://twitter.com/jmeistrich).

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/LegendApp/legend-list) on Github. And we welcome documentation PRs in our [documentation repo](https://github.com/LegendApp/legend-docs).

## Legend Kit

Legend Kit is our early but growing collection of high performance headless components, general purpose observables, transformer computeds, React hooks that don't re-render, and observable tools for popular frameworks. [Check out Legend Kit](https://www.legendapp.com/kit) to learn more.
