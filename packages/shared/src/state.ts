import { observable, type ObservableParam } from "@legendapp/state";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export const state$ = observable({
  packageManager: "bun" as PackageManager,
  exampleCount: 0,
  exampleTheme: "light",
  framework: 'React' as 'React' | 'React Native'
});
