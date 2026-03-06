Version 3 introduces first‑class Web support and a new SectionList component, plus several API improvements. It’s currently labeled **beta** while we collect feedback.

## ✨ New in v3

### Web Support
- DOM‑native rendering (no React Native dependency required)
- Same virtualization core as React Native
- Web examples and docs

### SectionList Component
- `@legendapp/list/section-list` with a React Native‑compatible API
- `scrollToLocation` support
- Sticky section headers powered by `stickyHeaderIndices`

### Always Render
- `alwaysRender` keeps selected items mounted outside the virtualization window

### Better Scroll & Metrics APIs
- `initialScrollAtEnd` for chat and feeds
- `onMetricsChange` for header/footer size changes
- `getState()` now exposes listeners, element access, and scroll velocity

## 🔄 Breaking changes from v2

1) **`maintainVisibleContentPosition` defaults**
   - v3 now enables scroll-position stabilization on size changes by default
   - Default behavior is equivalent to `maintainVisibleContentPosition={{ size: true, data: false }}`
   - Toggle specific behavior as needed:
     - `maintainVisibleContentPosition={{ data: true }}` to anchor on data changes too
     - `maintainVisibleContentPosition={{ size: false }}` to disable size/layout stabilization
     - `maintainVisibleContentPosition={true}` to enable both `size` and `data`
     - `maintainVisibleContentPosition={false}` to disable both

2) **Size callbacks argument order**
   - `getEstimatedItemSize` is now `(item, index, type)`
   - `getFixedItemSize` is now `(item, index, type)`

3) **Sticky headers prop rename**
   - `stickyIndices` → `stickyHeaderIndices` (deprecated alias kept for now)

4) **Typed import paths**
   - Root import `@legendapp/list` remains functional, but is deprecated for strict typing in v3.
   - Prefer:
     - React Native: `@legendapp/list/react-native`
     - React (Web): `@legendapp/list/react`

5) **Keyboard integration entrypoint update**
   - v2 keyboard docs used `@legendapp/list/keyboard-controller` and `LegendList`.
   - In v3 use `@legendapp/list/keyboard` and import `KeyboardAvoidingLegendList`.
   - `LegendList` is no longer exported from the `@legendapp/list/keyboard` entrypoint.

6) **Imperative scroll methods are async**
   - These ref methods now return `Promise<void>`:
     - `scrollIndexIntoView`
     - `scrollItemIntoView`
     - `scrollToEnd`
     - `scrollToIndex`
     - `scrollToItem`
     - `scrollToOffset`
   - If you run logic after a programmatic scroll, `await` the call.

7) **`getState()` shape changed for advanced integrations**
   - `state.positions` is no longer part of the public `getState()` return value.
   - Replace direct map access with:
     - `positionAtIndex(index)`
     - `positionByKey(key)`
   - `getState()` now also exposes listener helpers (`listen`, `listenToPosition`) and `scrollVelocity`.

## Migration checklist

- Update size callback signatures to `(item, index, type)`
- Replace `stickyIndices` with `stickyHeaderIndices`
- Move imports to typed platform entrypoints (`/react-native` or `/react`)
- Update keyboard imports from `@legendapp/list/keyboard-controller` to `@legendapp/list/keyboard` and use `KeyboardAvoidingLegendList`
- `await` imperative scroll calls if your code depends on post-scroll timing
- Update advanced `getState()` consumers to use `positionAtIndex` / `positionByKey` instead of `positions`

## Install

```npm
npm install @legendapp/list@beta
```
