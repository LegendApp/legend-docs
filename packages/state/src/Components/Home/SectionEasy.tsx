import { observable, type Observable } from "@legendapp/state";
import {
  Memo,
  Reactive,
  observer,
  useObservable,
} from "@legendapp/state/react";
import { useRef } from "react";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";
import { DemoBox, SectionTitle } from "./Components";

const CodeDemoTop = `
const settings$ = observable({ theme: 'dark' })

// get returns the raw data
settings$.theme.get() // 'dark'
// set sets
settings$.theme.set('light')

// Computed observables with just a function
const isDark$ = observable(() =>
    settings$.theme.get() === 'dark')

// observers re-run when observables change
observe(() => {
  console.log(settings$.theme.get())
})

`;

const DemoEasy = () => {
  return (
    <Editor
      code={CodeDemoTop}
      noInline
      renderCode={`;render(<div><Box><EasyComponent /></Box></div>)`}
      showEditing={false}
      scope={{
        useRef,
        useObservable,
        Button,
        Memo,
        observable,
        Box: DemoBox,
        FlashingDiv,
        Reactive,
        observer,
      }}
      classNameEditor="home-editor"
      hideDemo
      noError
    />
  );
};

export const SectionEasy = () => {
  return (
    <div className="flex !mt-24 gap-24">
      <div className="flex-1">
        <h3>🦄 Incredibly easy to use</h3>
        <p>
          When you get() while observing, it tracks those values and re-runs when they change. No
          boilerplate, no selectors, no dependency arrays, just easy reactivity.
        </p>
      </div>
      <div className="max-w-lg flex-2">
        <DemoEasy />
      </div>
    </div>
  );
};
