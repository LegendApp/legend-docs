import { observable } from "@legendapp/state";
import { Memo, Reactive, useObservable } from "@legendapp/state/react";
import React, { useRef } from "react";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { AnimatedBackground } from "./AnimatedBackground";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";

enableReactComponents();

const Examples = [
  `
function FineGrained() {
  const renderCount = useRef(1).current++

  const state$ = useObservable({ name: '', speed: 10 })

  const faster = () => state$.speed.set(prev => prev + 1)

  return (<>
    <div>Name:</div>
    <Reactive.input $value={state$.name} />

    <div>Speed: <Memo>{state$.speed}</Memo></div>
    <Button onClick={faster}>Go Faster!</Button>

    Renders: {renderCount}
  </>)
}
`,
];

export const Box = ({
  children,
  width,
  height,
}: {
  className?: string;
  theme?: "light" | "dark";
  center?: boolean;
  children: any;
  width?: number;
  height?: number;
}) => {
  return (
    <div
      className={"rounded-lg p-4 relative bg-gray-900 text-gray-200"}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};


const LandingPage: React.FC = () => {
  const state$ = useObservable({ name: "", speed: 10 });

  return (
    <div className="absolute inset-0 overflow-auto mt-11 flex flex-col text-white font-sans">
      <AnimatedBackground state$={state$} />
      <main className="z-10 flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Build faster apps faster</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Legend-State is a super fast all-in-one state and sync library
              that lets you write less code to make faster apps.
            </p>
          </div>
          <div className="!mt-20 max-w-3xl mx-auto">
            {Examples.map((example, index) => (
              <Editor
                key={index}
                code={example}
                noInline
                renderCode={`;render(<div><Box><FineGrained /></Box></div>)`}
                previewWidth={190}
                showEditing={false}
                scope={{
                  useRef,
                  useObservable,
                  Button,
                  Memo,
                  observable,
                  state$,
                  Box,
                  FlashingDiv,
                  Reactive,
                }}
                transformCode={(code) =>
                  code
                    .replace(
                      `const state$ = useObservable({ name: '', speed: 10 })`,
                      ""
                    )
                    .replace(
                      "<Reactive.input",
                      '<Reactive.input className="w-40 mt-1 rounded bg-gray-700 px-2 py-1"'
                    )
                    .replace("<div>Speed", '<div className="mt-8">Speed')
                    .replace(
                      '<Button ',
                      '<Button className="mb-8 bg-blue-800 hover:bg-blue-700"'
                    )
                    .replace(/<Memo>{(.*)}<\/Memo>/g, (a, b, c) => {
                      return `<Memo>
                        {() => (
                            <FlashingDiv span bg="bg-gray-900">
                                {${b}.get()}
                            </FlashingDiv>
                        )}
                    </Memo>`;
                    })
                }
                classNameEditor="home-editor"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
