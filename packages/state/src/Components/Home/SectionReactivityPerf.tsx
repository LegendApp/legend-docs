import { observable, type Observable } from "@legendapp/state";
import {
  Memo,
  Reactive,
  observer,
  useObservable,
} from "@legendapp/state/react";
import { useRef, useState } from "react";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { FlashingDiv } from "../FlashingDiv/FlashingDiv";
import { DemoBox, SectionTitle } from "./Components";
import { useInterval } from "usehooks-ts";
import { Header } from "./Header";
import { Text } from "./Text";

const CodeDemoPerf1 = `
// This example uses Memo to isolate renders
// to a single div so no components ever re-render

function TreeRight() {
  const renderCount = useRef(1).current++
  return <FlashingDiv bg="bg-gray-800" className="p-4 border border-gray-600 rounded !mt-0">
                <div className="font-bold">Tree Right</div>
                <div>Renders: {renderCount}</div>
              </FlashingDiv>
}
function TreeLeft({ count }) {
  const renderCount = useRef(1).current++
    return <FlashingDiv bg="bg-gray-800" className="p-4 border border-gray-600 rounded flex-1">
                <div className="font-bold">Tree Left</div>
                <div className="mb-4">Renders: {renderCount}</div>
                <TreeLeaf count={count} />
               </FlashingDiv>
}
function TreeLeaf({ count }) {
  const renderCount = useRef(1).current++
  return <FlashingDiv bg="bg-gray-700" className="p-4 border border-gray-500 rounded w-36">
                <div className="font-bold">Tree Leaf</div>
                <div>Renders: {renderCount}</div>
                <div>Count: {count}</div>
               </FlashingDiv>
}
function Tree() {
  const renderCount = useRef(1).current++
  const [count, setCount] = useState(1)

  useInterval(() => {
    setCount(v => v + 1)
  }, 600)

  return (
    <FlashingDiv className="p-4 bg-gray-900 border border-gray-700 rounded">
        <div className="font-bold">Tree</div>
        <div>Renders: {renderCount}</div>
        <div>Count: {count}</div>
        <div className="flex items-start pt-4 gap-4">
            <TreeLeft count={count} />
            <TreeRight />
        </div>
  </FlashingDiv>)
}
`;
const CodeDemoPerf2 = `
// This example uses Memo to isolate renders
// to a single div so no components ever re-render

function TreeRight() {
  return <FlashingDiv bg="bg-gray-800" className="p-4 border border-gray-600 rounded !mt-0">
                <div className="font-bold">Tree Right</div>
                <div>Renders: 1</div>
              </FlashingDiv>
}
function TreeLeft({ $count }) {
    return <FlashingDiv bg="bg-gray-800" className="p-4 border border-gray-600 rounded flex-1">
                <div className="font-bold">Tree Left</div>
                <div className="mb-4">Renders: 1</div>
                <TreeLeaf $count={$count} />
               </FlashingDiv>
}
function TreeLeaf({ $count }) {
  return <FlashingDiv bg="bg-gray-700" className="p-4 border border-gray-500 rounded w-36">
                <div className="font-bold">Tree Leaf</div>
                <div>Renders: 1</div>
                <div>Count: <Memo>{$count}</Memo></div>
               </FlashingDiv>
}
function Tree() {
  const count = useObservable(1)

  useInterval(() => {
    count.set(v => v + 1)
  }, 600)

  return (
    <FlashingDiv className="p-4 bg-gray-900 border border-gray-700 rounded">
        <div className="font-bold">Tree</div>
        <div>Renders: 1</div>
        <div>Count: <Memo>{count}</Memo></div>
        <div className="flex items-start pt-4 gap-4">
            <TreeLeft $count={count} />
            <TreeRight />
        </div>
  </FlashingDiv>)
}
`;

const DemoPerf1 = () => {
  return (
    <Editor
      code={CodeDemoPerf1}
      noInline
      renderCode={`;render(<div><Tree /></div>)`}
      previewWidth={380}
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
        useState,
      }}
      classNameEditor="home-editor"
      hideCode
    />
  );
};
const DemoPerf2 = () => {
  return (
    <Editor
      code={CodeDemoPerf2}
      noInline
      renderCode={`;render(<div><Tree /></div>)`}
      previewWidth={380}
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
      transformCode={(code) =>
        code.replace(/<Memo>{(.*)}<\/Memo>/g, (a, b, c) => {
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
      hideCode
    />
  );
};

export const SectionReactivityPerf = () => {
  return (
    <div className="mt-section">
      <div className="max-w-lg">
        <Header size="h2" className="flex-1">
          ⚡️ Fine-grained reactivity
        </Header>
        <Text className="flex-1 !mt-4">
          A built-in set of control-flow components make it easy to isolate
          re-renders to only the tiniest element that changed.
        </Text>
      </div>
      <div className="flex justify-center pt-8">
        <div className="inline-flex mx-auto justify-center t-bg-dark t-border border rounded-xl shadow-dark">
          <div className="flex-1 max-w-[460px] border-r t-border px-8 py-6">
            <Header size="h4" className="text-center">Normal React</Header>
            <DemoPerf1 />
          </div>
          <div className="flex-1 !-mt-0 max-w-[460px] px-8 py-6">
            <Header size="h4" className="text-center">Legend-State</Header>
            <DemoPerf2 />
          </div>
        </div>
      </div>
    </div>
  );
};
