Legend List is a high performance virtualized list for React Native. Compared to FlatList and FlashList it's faster, simpler, and supports dynamic item sizes without hacks.

- ✨ Extremely fast
- ✨ Dynamic item sizes
- ✨ Optional recycling
- ✨ Bidirectional infinite lists
- ✨ Chat list without inverting
- ✨ Maintain content view position
- ✨ Recycling hooks

<Callout>
Building for the web? Start with <a href="../../react/getting-started">Getting Started (Web)</a> instead.
</Callout>

For more information, check out:
- [Legend List: Optimizing for Mobile & Web | React Universe Conf 2025](https://www.youtube.com/watch?v=Ui3qVl80Pzg)
- [Legend List: Optimizing for Peak List Performance | App.js Conf 2025](https://www.youtube.com/watch?v=4nfxSE9OByQ)
- [Jay's conversation on React Native Radio](https://infinite.red/react-native-radio/rnr-325-legend-list-with-jay-meistrich)

## It's fast!

This video was recorded as a performance test scrolling ludicrously fast with heavy items. LegendList handles expensive components with a quick recovery.

<div className="w-[800px] max-w-full mx-auto rounded-xl overflow-hidden">
    <video
        src="/open-source/assets/legendlist2.mp4"
        controls
        width="100%"
        height="100%"
        autoPlay
        loop
        muted
        className="rounded-xl"
    />
</div>

<br />

## It uses less resources

A FlashLight measurement of the above test shows that LegendList uses less CPU while scrolling. And it uses less memory too! See the [FlashLight results](/open-source/list/flashlight.html) for more details.

<img src="/open-source/list/flashlight.png" className="w-[800px] max-w-full mx-auto mt-8 rounded-xl overflow-hidden border border-fd-border" />

## Install

```npm
npm install @legendapp/list
```

## Usage

Legend List is a drop-in replacement for FlatList or FlashList. It only renders the items that are in view, which significantly reduces render cost for long lists.

### Quick Start

```jsx
import { Text } from "react-native";
import { LegendList } from "@legendapp/list/react-native";

const items = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" },
];

export function MyList() {
  return (
    <LegendList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={(item) => item.id}
      recycleItems
    />
  );
}
```

### Switch from FlashList

If you're coming from FlashList, in most cases you can just rename the component and it will work as expected. Legend List does not recycle items by default, so to match FlashList's behavior you can enable `recycleItems`.

```diff
return (
-  <FlashList
+  <LegendList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
+     recycleItems
  />
)
```

### Switch from FlatList

Legend List should immediately be much faster. But you may want to add the `recycleItems` prop for extra performance.

```diff
return (
-  <FlatList
+  <LegendList
      data={items}
      renderItem={({ item }) => <Text>{item.title}</Text>}
+     recycleItems
  />
)
```

See [API Reference](../../api) for all properties of LegendList.

## Supported Platforms

- Android
- iOS
- React Native MacOS
- React Native Windows
- TV platforms
- Any React Native platform should work since there's no native code, but if not please let us know!

## Community

Join us on [Discord](https://discord.gg/5CBaNtADNX) or [Github](https://github.com/LegendApp/legend-list) to get involved with the Legend community.

Talk to Jay on [Bluesky](https://bsky.app/profile/jayz.us) or [Twitter](https://twitter.com/jmeistrich).

## Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/LegendApp/legend-list) on Github. And we welcome documentation PRs in our [documentation repo](https://github.com/LegendApp/legend-docs).

## Legend Kit

Legend Kit is our early but growing collection of high performance headless components, general purpose observables, transformer computeds, React hooks that don't re-render, and observable tools for popular frameworks. [Check out Legend Kit](https://www.legendapp.com/kit) to learn more.
