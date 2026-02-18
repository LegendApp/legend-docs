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

1) **`maintainVisibleContentPosition` behavior**
   - v2 default: always anchors during data changes
   - v3 default: only stabilizes during scroll/layout changes
   - To restore v2 behavior: `maintainVisibleContentPosition={{ data: true }}` or simply `true`

2) **Size callbacks argument order**
   - `getEstimatedItemSize` is now `(item, index, type)`
   - `getFixedItemSize` is now `(item, index, type)`

3) **Sticky headers prop rename**
   - `stickyIndices` → `stickyHeaderIndices` (deprecated alias kept for now)

## Migration checklist

- Update size callback signatures to `(item, index, type)`
- Replace `stickyIndices` with `stickyHeaderIndices`
- If you relied on data‑change anchoring, set `maintainVisibleContentPosition={{ data: true }}`
- (Optional) Consider `alwaysRender` for pinned items

## Install

```npm
npm install @legendapp/list
```
