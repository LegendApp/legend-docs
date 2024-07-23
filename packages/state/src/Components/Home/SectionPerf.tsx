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
import { useInterval } from "usehooks-ts";

const CodeDemoPerf = `
// This example uses Memo to isolate renders
// to a single div so no components ever re-render

function TreeRight() {
  return <div>Tree Right</div>
}
function TreeLeft({ $count }) {
    return <TreeLeaf $count={$count} />
}
function TreeLeaf({ $count }) {
  return <div>Count: <Memo>{$count}</Memo></div>
}
function Tree() {
  const count = useObservable(1)

  useInterval(() => {
    count.set(v => v + 1)
  }, 600)

  return (<>
    <div>Count: <Memo>{count}</Memo></div>
    <TreeLeft $count={count} />
    <TreeRight />
  </>)
}
`;

const DemoPerf = () => {
  return (
    <Editor
      code={CodeDemoPerf}
      noInline
      renderCode={`;render(<div><Box><Tree /></Box></div>)`}
      previewWidth={360}
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
        useInterval,
      }}
      transformCode={
        (code) =>
          code
            // Leaf
            .replace(
              `<div>Count: <Memo>{$count}</Memo></div>`,
              `<div className="p-4 bg-gray-700 border border-gray-500 rounded">
                <div className="font-bold">Tree Leaf</div>
                <div>Renders: 1</div>
                <div>Count: <Memo>{$count}</Memo></div>
               </div>`
            )
            // Left
            .replace(
              `<TreeLeaf $count={$count} />`,
              `<div className="p-4 bg-gray-800 border border-gray-600 rounded flex-1">
                <div className="font-bold">Tree Left</div>
                <div>Renders: 1</div>
                <TreeLeaf $count={$count} />
               </div>`
            )
            // Right
            .replace(
              `<div>Tree Right</div>`,
              `<div className="p-4 bg-gray-800 border border-gray-600 rounded !mt-0">
                <div className="font-bold">Tree Right</div>
                <div>Renders: 1</div>
              </div>`
            )
            .replace(
              `return (<>
    <div>Count: <Memo>{count}</Memo></div>
    <TreeLeft $count={count} />
    <TreeRight />
  </>)`,
              `return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded">
        <div className="font-bold">Tree</div>
        <div>Renders: 1</div>
        <div>Count: <Memo>{count}</Memo></div>
        <div className="flex items-start pt-4 gap-4">
            <TreeLeft $count={count} />
            <TreeRight />
        </div>
  </div>)`
            )
          .replace(/<Memo>{(.*)}<\/Memo>/g, (a, b, c) => {
            const bg = c > 1000 ? "bg-gray-900" : "bg-gray-700";
            return `<Memo>
                        {() => (
                            <FlashingDiv span bg="${bg}">
                                {${b}.get()}
                            </FlashingDiv>
                        )}
                    </Memo>`;
          })
      }
      classNameEditor="home-editor"
    />
  );
};

export const SectionPerf = () => {
  return (
    <div className="!mt-20 max-w-4xl mx-auto">
      <SectionTitle
        text="🚀 The fastest React state library"
        description="Legend-State is so fast that it outperforms even vanilla JS in some benchmarks. Extremely optimized at just 4kb and encouraging fine-grained reactivity, it reduces code and file size while maximizing performance."
      />
      <DemoPerf  />
    </div>
  );
};
