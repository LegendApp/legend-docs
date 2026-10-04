<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

## Spark-owned projects

Edit `desktop.config.json`; generated `app.json` is Expo's transport configuration. Universal projects use a generated `app.config.js` resolver. Retain the generated stable `projectId`: it scopes storage and runtime identity across app renames and builds.

```json
{
  "$schema": "./node_modules/@legendapp/spark/schema.json",
  "projectId": "f478dff4-f9a1-4ff2-8096-64df89e1c470",
  "name": "MyApp",
  "version": "0.0.1",
  "platforms": ["macos"],
  "window": {
    "size": { "width": 1000, "height": 700 },
    "minSize": { "width": 500, "height": 300 },
    "restoreBounds": true
  },
  "macos": { "bundleIdentifier": "com.example.myapp" }
}
```

Sizes are outer-frame logical dimensions. AppKit-specific chrome is grouped under `window.macos`, including `titleBar.trafficLights` and `backgroundMaterial`. Portable defaults stay in `window`; native startup behavior stays in `macos.lifecycle`.

Spark owns identity, windows, document associations, update signing, helper bundles, and desktop lifecycle policy. Expo settings/plugins go in `expo` or `expoByPlatform.<target>`. Custom native settings may require an app-specific binary.

`@legendapp/spark/config` exports typed configuration/readers. `toExpo` validates untrusted Spark JSON. The schema supports editor checks; runtime validation also checks target, size, helper-path, and update relationships.

## Existing Expo apps

From a prepared local SDK checkout:

```sh
npm run spark -- add desktop --project /absolute/path/to/ExistingExpoApp
```

The integration checks the installed Expo `54.0.37`, React Native `0.81.6`, and React `19.1.4` baseline before editing. Upgrading an incompatible app is separate work. It preserves the entry point, source, existing mobile/web scripts, and mobile native projects. Existing desktop script names are preserved, using `spark:macos`/`spark:windows` when needed.

Expo remains the source for app name/version and shared settings. The sidecar declares `extends: "expo"`, stable identity, desktop platforms, and desktop options. `withSparkExpo` from `/expo-config` composes the existing config; ordinary Expo commands retain their mobile/web meaning. Spark commands select the desktop/shared session environment automatically.

Review generated integration files and run the app's existing checks. Automatic config composition has restrictions on export shapes, module format, and Metro/native config filenames. Existing desktop projects need explicit host composition. See [the integration guide](https://github.com/LegendApp/legend-spark/blob/main/docs/add-desktop.md); preserving an Expo Router entry does not establish desktop Router support.

## Metro and native discovery

Retain the generated wrappers and apply application customizations through them. For a Spark-owned project:

```js
// metro.config.js
const { metroConfig } = require('@legendapp/spark/metro');
module.exports = metroConfig(__dirname);
```

```js
// react-native.config.js
module.exports = require('@legendapp/spark/native').nativeConfig(__dirname);
```

For an existing Expo project, compose its configuration:

```js
const { getDefaultConfig, withSparkMetro } = require('@legendapp/spark/metro');
const config = getDefaultConfig(__dirname);
module.exports = withSparkMetro(config);
```

`withSparkNative(existingConfig, __dirname)` preserves app assets and native settings. `withSparkMetro` accepts asynchronous wrappers as well. `/expo-metro` and `/universal` were removed; use `/metro`.

## Native lifecycle

The standard Spark AppDelegate owns React bootstrap and app event dispatch. `macos.lifecycle.mainWindow` can configure initial visibility, close behavior, and reopen policy. Native packages can opt into startup plugins and asynchronous quit handlers without replacing the app delegate. Link/include a plugin that must survive production pruning.

A hidden main window keeps the runtime alive; it does not make the app menu-bar-only. Runtime close/quit guards and [document coordination](/spark/documents) own asynchronous application decisions. See [native lifecycle](https://github.com/LegendApp/legend-spark/blob/main/docs/host-migration.md) and [configuration details](https://github.com/LegendApp/legend-spark/blob/main/docs/configuration.md).
