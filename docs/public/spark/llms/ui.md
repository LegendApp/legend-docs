<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Common controls

Import `Button`, `TextInput`, `Select`, and `SegmentedControl` from `@legendapp/spark/ui`:

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Select } from '@legendapp/spark/ui';

export function Preferences() {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('system');
  return (
    <View>
      <TextInput value={name} onChangeText={setName} accessibilityLabel="Name" />
      <Select
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        value={theme}
        onValueChange={setTheme}
        accessibilityLabel="Appearance"
      />
      <Button onPress={() => console.log({ name, theme })}>Save</Button>
    </View>
  );
}
```

Controls share `disabled`, `accessibilityLabel`, `testID`, layout `style`, `onError`, and a `ControlRef` supporting `measureInWindow`. Shared refs do not expose backend objects or a universal focus/text mutation API.

TextInput is single-line and supports either controlled `value` or uncontrolled `defaultValue`. Those modes are mutually exclusive; remount to switch modes/reset an uncontrolled field. Defaults initialize once. Controlled desktop edits acknowledge native event counts; mobile controlled editing uses React Native TextInput.

Select and SegmentedControl share unique string-valued options and controlled `value`/`onValueChange`. Labels may repeat; a missing selected value does not implicitly select the first option. A parent that declines a choice retains its current selection.

| Control | macOS | Windows | iOS | Android | Web |
| --- | --- | --- | --- | --- | --- |
| Button | AppKit | WinUI | Expo SwiftUI | Expo Compose | HTML button |
| TextInput | AppKit | WinUI | RN TextInput | RN TextInput | HTML input |
| Select | Popup | ComboBox | Menu picker | Inline choices | HTML select |
| SegmentedControl | Segmented control | Unsupported | Segmented picker | Inline choices | Button group |

`getControlAvailability` is synchronous. Missing/unsupported native controls report through `onError` (default console logging) and render a disabled fallback with current label/text. Invalid props throw during render. A fallback is not a functioning native control.

Mobile Button/Select use optional `@expo/ui@0.2.0-beta.9` with Expo 54; Compose requires a development build. Windows UI/native acceptance remains pending.

## Specialized macOS views

| Import | Contract |
| --- | --- |
| `/ui/search` | `TextInputSearch`, controlled/default input, explicit appearance, focus/blur/measurement ref |
| `/ui/sidebar` | Controlled nullable `selectedId`, required `onSelectionChange`, item-array or `SidebarItem` composition, typed context-menu coordinates |
| `/ui/split-view` | `SidebarSplitView` with named `sidebar`/`content` panes, grouped title-bar options and provisional/ready layout events |
| `/ui/glass` | `GlassView`, regular/clear styles and RN color tint; native effect requires macOS 26 |
| `/ui/symbol` | `SFSymbol`, Apple-specific symbol names, layout/accessibility props and missing-symbol errors |

These views have safe synchronous availability queries and `onError`. Unsupported hosts preserve ordinary layout/content and report the limitation. Split layout readiness comes from native events; initial metrics are hints. Zero pane dimensions remain zero. Older macOS retains GlassView children without the effect.

```tsx
import { SidebarSplitView } from '@legendapp/spark/ui/split-view';
import { View, Text } from 'react-native';

<SidebarSplitView
  sidebar={<View><Text>Navigation</Text></View>}
  content={<View><Text>Editor</Text></View>}
  titleBar={{ content: { height: 52, material: 'glass' } }}
  onResize={event => console.log(event.phase, event.contentX)}
/>
```

## Settings windows

`/settings/window` exports `SettingsWindow`, `VirtualizedSettingsWindow`, named props/pages, and `createSettingsWindowOptions`. Both use `{ id, title, render }` pages and an explicit `windowId`. Use controlled `selectedPageId`/`onSelectionChange` or mount-time `defaultPageId`, with one selection owner.

This composition requires `@legendapp/list` and macOS split-view support. It shows a hidden window only after layout/initial-scroll readiness. When native split view is unavailable, the fallback has no readiness event and the settings window stays hidden. Handle `onError`; check availability before selecting this composition for a target.

## Styling

`/ui/uniwind` exports the same four common controls with optional `className` integration. Classes shape layout around native controls; arbitrary OS chrome styling is not promised. Explicit style takes precedence. `/ui/classnames` is a library-specific `clsx`/`tailwind-merge` convenience.

Use ordinary React Native views/text for surrounding screens. Uniwind supports application theme choices `system`, `light`, and `dark`; theme persistence belongs to the app. Windows Appearance overrides update mounted WinUI controls through the native theme module.

See [UI contracts](https://github.com/LegendApp/legend-spark/blob/main/docs/ui.md) and [styling setup](https://github.com/LegendApp/legend-spark/blob/main/docs/styling.md). Router integration and a broad cross-platform component catalog remain outside the supported scope.
