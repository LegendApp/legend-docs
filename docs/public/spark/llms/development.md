<Callout type="warn" title="Experimental source documentation">
These guides describe the current source checkout. The published preview predates the recent API changes. See [release status](/spark/limitations) before choosing an SDK.
</Callout>

`npm run dev`, `npm start`, and the generated desktop scripts enter one managed Expo CLI development session. Expo owns Metro, logs, reload, debugging, and mobile/web actions; Spark adds desktop runtime selection and compatibility checks.

## Terminal actions

| Key | Action |
| --- | --- |
| `d` | Open the host desktop target |
| `g` | Switch Spark Runner/custom development build without compiling |
| `b` | Build and open a required custom development binary |
| `r`, `j`, `m` | Expo reload, debugger, and development menu |
| `i`, `a`, `w` | Declared iOS, Android, and web targets |
| `s` | Mobile Expo Go/development-client selection |
| `?` | Current command table |
| Ctrl+C | Exit the session and close its owned native app |

Expo Go is a mobile runtime; it is separate from Spark Runner. Switching binaries or restarting Metro can reset React state. Desktop selection is remembered in `.spark/settings.json`.

A universal session serves all declared targets. A missing/incompatible desktop binary blocks that desktop bundle while mobile/web remain available. `--platform` chooses an initial launch; it does not add a platform to the project.

```sh
npx --no-install spark dev --no-open
npx --no-install spark dev --platform ios
npx --no-install spark dev --port 8082 --localhost
```

Expo start flags such as `--clear`, `--offline`, `--lan`, `--tunnel`, and `--max-workers` pass through. Use `spark dev --help` for the full list. Desktop launch uses the port Expo reports.

## Native changes

Extra native modules, URL/document associations, helper binaries, or native settings/plugins can require an app-specific build. Spark checks native requirements before loading JavaScript; it does not automatically compile every edit.

```sh
npx --no-install spark build --dev --platform macos
# On Windows:
npx --no-install spark build --dev --platform windows
```

`build --dev --force` forces regeneration and compilation. Author durable native changes in packages/config plugins; generated native directories are disposable. Run native generation/build operations sequentially in one checkout.

To select Intel macOS from a consumer project:

```sh
SPARK_MACOS_ARCH=x64 npx --no-install spark build --dev
SPARK_MACOS_ARCH=x64 npx --no-install spark dev
```

`SPARK_MACOS_ARCH=arm64|x64` and `SPARK_WINDOWS_ARCH=x64|arm64` select build targets. The matching architecture is part of runtime compatibility. Selecting an architecture does not establish native acceptance or supply a missing hosted Runner.

## Production selection

```sh
npx --no-install spark analyze
npm run build
```

Analysis records production reachability in `.spark/selection-report.json`. SDK native modules can be pruned; unknown third-party native dependencies are retained. Keep native-only requirements in configuration. `build --preview` uses the production native selection in Debug; it is distinct from the standalone embedded-bundle build.

## SDK iteration and diagnostics

Repack after SDK source changes and rebuild/register a Runner when its native signature changes. From the framework checkout, `node scripts/refresh-consumer.ts /path/to/app` refreshes a local test consumer's SDK archives. Content-hashed archives avoid stale package-manager cache identities. Use real packed consumers for distribution checks.

`spark doctor` diagnoses native prerequisites. Generated diagnostics live under `.spark/`: command records, full build logs, native selection, compatibility session state, and product/fingerprint records. Keep those outputs out of version control.

See [configuration](/spark/configuration), [examples and validation](/spark/examples), and the [SDK development guide](https://github.com/LegendApp/legend-spark/blob/main/docs/development.md).
