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
const speed$ = observable(1)

const EasyComponent = observer(() => {
  const speed = speed$.get()

  const reset = () => speed$.set(1)

  return (<>
    <Reactive.input $value={speed$} type="number" />
    <Button onClick={reset}>{speed} is too fast 😱</Button>
  </>)
})
`;

const DemoTop = ({ state$ }: { state$: Observable<{ speed: number }> }) => {
  return (
    <div className="relative max-w-lg">
      <Editor
        code={CodeDemoTop}
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
        transformCode={
          (code) =>
            code
              .replace(`const speed$ = observable(1)`, "")
              .replace(
                "<Reactive.input",
                '<Reactive.input className="w-40 mt-4 rounded bg-gray-700 px-2 py-2"'
              )
              .replace("<div>Speed", '<div className="mt-8">Speed')
              .replace(
                "<Button ",
                '<Button className="bg-blue-800 hover:bg-blue-700"'
              )
              .replace(/speed\$/g, "state$.speed")
          //   .replace(/globalState\$.name/g, "state$.name")
          //   .replace(/speed\$\./g, "state$.speed.")
        }
        classNameEditor="home-editor"
        classNamePreview="absolute right-0 top-0 !-mt-24 -mr-16 shadow shadow-blue-500"
      />
    </div>
  );
};

export const SectionTop = ({
  state$,
}: {
  state$: Observable<{ speed: number }>;
}) => {
  return (
    <div className="grid grid-cols-3 !-mt-8">
      <div />
      <div className="col-span-2">
        <DemoTop state$={state$} />
      </div>
    </div>
  );
};
