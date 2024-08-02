import { AnimatePresence, motion } from "framer-motion";
import { observable, type Observable } from "@legendapp/state";
import {
  Memo,
  Reactive,
  Show,
  observer,
  useMount,
  useObservable,
} from "@legendapp/state/react";
import { useRef } from "react";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";
import { DemoBox, SectionTitle } from "./Components";
import CurvedArrowCallout from "./CurvedArrowCallout";

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
        previewWidth={180}
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
                '<Reactive.input className="w-20 mt-4 rounded bg-gray-700 px-2 py-2" min="1" max="100"'
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
        classNamePreview="absolute right-0 top-0 !-mt-12 -mr-12 shadow-lg border border-gray-800 rounded-lg"
      />
    </div>
  );
};

export const SectionTop = ({
  state$,
}: {
  state$: Observable<{ speed: number }>;
}) => {
  const arrowVisible$ = observable(true);
  useMount(() => {
    state$.speed.onChange(() => {
      arrowVisible$.set(false);
    });
  });

  return (
    <div className="grid grid-cols-3 !-mt-4">
      <div className="pointer-events-none" />
      <div className="col-span-2 relative">
        <DemoTop state$={state$} />

        <Show if={arrowVisible$} wrap={AnimatePresence}>
          {() => (
            <motion.div
              className="absolute top-0 left-0 pointer-events-none"
              style={{ marginLeft: 260, marginTop: -70 }}
              initial={{ opacity: 0.6 }}
              animate={{
                opacity: 1,
                transition:{
                  duration: 0.7,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
              }}
              exit={{ opacity: 0 }}
            >
              <div className="rotate-12">
                <CurvedArrowCallout />
              </div>
              <div className="absolute top-0 left-0 !mt-10 -ml-6 text-sm font-bold">
                Turn it up!
              </div>
            </motion.div>
          )}
        </Show>
      </div>
    </div>
  );
};
