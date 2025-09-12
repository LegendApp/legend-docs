import { observable } from '@legendapp/state';
import { Memo, observer, useObservable } from '@legendapp/state/react';
import { useRef, useState } from 'react';
import { Button } from './Button';
import { useInterval } from 'usehooks-ts';
import { FlashingDiv } from './FlashingDiv';
import { DemoBox } from './Components';
import { Header } from './Header';
import { Text } from './Text';
import { Editor } from '@/components/Editor';
import { EditorStateHome } from '@/components/EditorStateHome';

const CodeDemoPerf1 = `
// This example uses Memo to isolate renders
// to a single div so no components ever re-render

function TreeRight() {
  const renderCount = useRef(1).current++
  return (
    <FlashingDiv bg="bg-gray-800" className="p-3 sm:p-4 border border-gray-600 rounded !mt-0">
        <div className="font-bold">Right</div>
        <div>Renders: {renderCount}</div>
    </FlashingDiv>
)
}
function TreeLeft({ count }) {
  const renderCount = useRef(1).current++
    return <FlashingDiv bg="bg-gray-800" className="p-3 sm:p-4 border border-gray-600 rounded flex-1">
                <div className="font-bold">Left</div>
                <div className="mb-4">Renders: {renderCount}</div>
                <TreeLeaf count={count} />
               </FlashingDiv>
}
function TreeLeaf({ count }) {
  const renderCount = useRef(1).current++
  return <FlashingDiv bg="bg-gray-700" className="p-3 sm:p-4 border border-gray-500 rounded w-36">
                <div className="font-bold">Leaf</div>
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
    <FlashingDiv className="p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded">
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
  return <FlashingDiv bg="bg-gray-800" className="p-3 sm:p-4 border border-gray-600 rounded !mt-0">
                <div className="font-bold">Right</div>
                <div>Renders: 1</div>
              </FlashingDiv>
}
function TreeLeft({ $count }) {
    return <FlashingDiv bg="bg-gray-800" className="p-3 sm:p-4 border border-gray-600 rounded flex-1">
                <div className="font-bold">Left</div>
                <div className="mb-4">Renders: 1</div>
                <TreeLeaf $count={$count} />
               </FlashingDiv>
}
function TreeLeaf({ $count }) {
  return <FlashingDiv bg="bg-gray-700" className="p-3 sm:p-4 border border-gray-500 rounded w-36">
                <div className="font-bold">Leaf</div>
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
    <FlashingDiv className="p-3 sm:p-4 bg-gray-900 border border-gray-700 rounded">
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
        <EditorStateHome
            code={CodeDemoPerf1}
            noInline
            renderCode={`;render(<div><Tree /></div>)`}
            showEditing={false}
            scope={{
                useRef,
                useObservable,
                Button,
                Memo,
                observable,
                Box: DemoBox,
                FlashingDiv,
                observer,
                useInterval,
                useState,
            }}
            classNameEditor="home-editor"
            classNamePreview="md:w-[380px]"
            hideCode
        />
    );
};
const DemoPerf2 = () => {
    return (
        <EditorStateHome
            code={CodeDemoPerf2}
            noInline
            renderCode={`;render(<div><Tree /></div>)`}
            showEditing={false}
            scope={{
                useRef,
                useObservable,
                Button,
                Memo,
                observable,
                Box: DemoBox,
                FlashingDiv,
                observer,
                useInterval,
            }}
            transformCode={(code) =>
                code.replace(/<Memo>{(.*)}<\/Memo>/g, (a, b, c) => {
                    const bg = c > 1000 ? 'bg-gray-900' : 'bg-gray-700';
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
            classNamePreview="md:w-[380px]"
            hideCode
        />
    );
};

export const SectionFineGrained = () => {
    return (
        <div className="mt-section px-4">
            <div className="max-w-2xl mx-auto">
                <Header size="h2" className="flex-1">
                    ⚡️ Fine-grained reactivity in React
                </Header>
                <Text className="flex-1 !mt-4">
                    Achieve incredible performance by minimizing the number and size of renders. <br />
                    Legend State makes apps fast by default because they just do less work.
                </Text>
            </div>
            <div className="flex justify-center pt-8">
                <div className="lg:flex mx-auto justify-center sm:bg-tBgDark border-tBorder divide-tBorder lg:divide-x sm:border rounded-xl sm:shadow-md sm:shadow-tShadowDark">
                    <div className="flex-1 lg:max-w-[460px] px-8 py-6 flex flex-col items-center">
                        <Header size="h4" className="text-center">
                            Normal React
                        </Header>
                        <DemoPerf1 />
                    </div>
                    <div className="flex-1 !-mt-0 lg:max-w-[460px] px-8 py-6 flex flex-col items-center">
                        <Header size="h4" className="text-center">
                            Legend-State
                        </Header>
                        <DemoPerf2 />
                    </div>
                </div>
            </div>
        </div>
    );
};
