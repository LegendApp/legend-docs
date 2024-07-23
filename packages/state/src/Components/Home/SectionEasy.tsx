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

const CodeDemoEasy = `
const globalState$ = observable({ name: '' })

const EasyComponent = observer(() => {
  const speed$ = useObservable(1)

  const speed = speed$.get()
  const name = globalState$.name.get()

  const faster = () => speed$.set(prev => prev + 1)
  const reset = () => speed$.set(1)

  return (<>
    <div>Name: {name}</div>
    <Reactive.input $value={globalState$.name} />

    <div>Speed: {speed}</div>
    <Button onClick={faster}>Go Faster! 🚀</Button>
    <Button onClick={reset}>It's too fast 😱</Button>
  </>)
})
`;

const DemoEasy = ({ state$ }: { state$: Observable<{ speed: number }> }) => {
  return (
    <Editor
      code={CodeDemoEasy}
      noInline
      renderCode={`;render(<div><Box><EasyComponent /></Box></div>)`}
      previewWidth={190}
      showEditing={false}
      scope={{
        useRef,
        useObservable,
        Button,
        Memo,
        observable,
        state$,
        Box: DemoBox,
        FlashingDiv,
        Reactive,
        observer,
      }}
      transformCode={(code) =>
        code
          .replace(`const state$ = useObservable({ name: '', speed: 1 })`, "")
          .replace(
            "<Reactive.input",
            '<Reactive.input className="w-40 mt-4 rounded bg-gray-700 px-2 py-2"'
          )
          .replace("<div>Speed", '<div className="mt-8">Speed')
          .replace(
            "<Button ",
            '<Button className="bg-blue-800 hover:bg-blue-700"'
          )
          .replace(
            "const speed = speed$.get()",
            "const speed = state$.speed.get()"
          )
          .replace(/globalState\$.name/g, "state$.name")
          .replace(/speed\$\./g, "state$.speed.")
      }
      classNameEditor="home-editor"
    />
  );
};

export const SectionEasy = ({
  state$,
}: {
  state$: Observable<{ speed: number }>;
}) => {
  return (
    <div className="!mt-20 max-w-3xl mx-auto">
      <SectionTitle
        text="🦄 As easy as possible to use"
        description="Legend-State uses easy get/set methods with observers that automatically update your UI, with Reactive components for easy two-way binding, and more fine-grained reactivity tools."
      />
      <DemoEasy state$={state$} />
    </div>
  );
};
