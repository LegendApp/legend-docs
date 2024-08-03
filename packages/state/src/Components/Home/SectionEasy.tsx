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
import { Header } from "./Header";
import { Text } from "./Text";

const CodeDemoTop = `
const settings$ = observable({ theme: 'dark' })

// Infinitely nested observables
const theme$ = settings$.theme

// get returns the raw data
theme$.get() // 'dark'

// set sets
theme$.set('light')

// Computed observables with just a function
const isDark$ = observable(() =>
    theme$.get() === 'dark'
)

// observers re-run when observables change
observe(() => {
  console.log(theme$.get())
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
    <div className="flex mt-section gap-16 items-center">
      <div className="flex-1">
        <Header size="h2" className="!mt-0">
          🦄 Incredibly easy to use
        </Header>
        <Text className="pt-2">
          When you get() values while observing, it tracks them and re-runs when
          they change. No boilerplate, no selectors, no dependency arrays, just
          easy reactivity.
        </Text>
      </div>
      <div className="max-w-lg flex-2 !mt-0 [&>div]:!mt-0">
        <DemoEasy />
      </div>
    </div>
  );
};

/*
        <div className="inline-flex items-center gap-2 border t-border rounded-full px-4 py-1 text-blue-600 text-xs font-semibold">
          <div className="bg-blue-600 rounded-full w-3 h-1.5 text-white text-xs font-semibold" />
          Easy
        </div>
        */