import { observable } from "@legendapp/state";
import { Memo, useObservable } from "@legendapp/state/react";
import { useRef, useState } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { useInterval } from "usehooks-ts";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";

const PRIMITIVES_CODE = `
import { observable } from "@legendapp/state"
import { Memo, useObservable } from "@legendapp/state/react"
import { useRef, useState } from "react"
import { useInterval } from "usehooks-ts"

function NormalComponent() {
  const [count, setCount] = useState(1)
  const renderCount = useRef(1).current++

  useInterval(() => {
    setCount((v) => v + 1)
  }, 600)

  // This re-renders when count changes
  return (
    <FlashingDiv>
      <h5>Normal</h5>
      <div>Renders: {renderCount}</div>
      <div>Count: {count}</div>
    </FlashingDiv>
  )
}
function FineGrained() {
  const count$ = useObservable(1)
  const renderCount = useRef(1).current++

  useInterval(() => {
    count$.set((v) => v + 1)
  }, 600)

  // The text updates itself so the component doesn't re-render
  return (
    <FlashingDiv>
      <h5>Fine-grained</h5>
      <div>Renders: {renderCount}</div>
      <div>Count: <Memo>{count$}</Memo></div>
    </FlashingDiv>
  )
}
`;

export function Primitives() {
  return (
    <div>
      <Editor
        code={PRIMITIVES_CODE}
        noInline
        renderCode={`;render(<div><NormalComponent /><div className="!mt-4" /><FineGrained /></div>)`}
        previewWidth={150}
        scope={{
          useState,
          useRef,
          useInterval,
          FlashingDiv,
          useObservable,
          Memo,
          observable,
        }}
        transformCode={(code) =>
          code.replace(
            `<div>Count: <Memo>{count$}</Memo></div>`,
            `<div>Count:{" "}
                <Memo>
                    {() => (
                        <FlashingDiv span>
                            {count$.get()}
                        </FlashingDiv>
                    )}
                </Memo>
            </div>`
          )
        }
      />
    </div>
  );
}
