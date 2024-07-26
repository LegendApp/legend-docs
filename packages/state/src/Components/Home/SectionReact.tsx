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

const CodeDemoObserver = `
const EasyComponent = observer(() => {
  const count = count$.get()

  const increment = () =>
    count$.set(count => count + 1)

  useObserveEffect(() => {
    document.title = \`Count: \${count}\`;
  })

  return (
    <div>Count: {count} />
    <Button onClick={add}>Increment</Button>
  )
})
`;

const CodeDemoReactive = `

const Form = () => {
  const form$ = observable({
    value: '',
    submitting: false
  });

  return (
    <Reactive.input
        $value={form$.value}
        $className={() => cx(
            isValid(form$.value.get()) ?
                'border-green-500' : 'border-red-500'
        )}
        $disabled={form$.submitting}
    />
  )
}
`;

const DemoObserver = () => {
  return (
    <Editor
      code={CodeDemoObserver}
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

const DemoReactive = () => {
  return (
    <Editor
      code={CodeDemoReactive}
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

export const SectionReact = () => {
  return (
    <div className="!mt-24">
      <h2 className="text-center">🦄 Makes React fun, fast, and easy</h2>
      <div className="flex gap-16">
        <div className="flex-1">
          <div>
            <p className="font-bold text-white">
              observer makes components reactive
            </p>
            <p className="text-gray-350">
              You don't need any complicated selectors or anything. Just get an
              observable value and the component will re-render itself when it
              changes.
            </p>
          </div>
          <DemoObserver />
        </div>
        <div className="flex-1 !mt-0">
          <div>
            <p className="font-bold text-white">
              Two-way binding with Reactive components
            </p>
            <p className="text-gray-350">
              No more change handlers, just bind observables to inputs. Reactive props simplify logic and optimize performance with the tiniest possible rerenders.
            </p>
          </div>
          <DemoReactive />
        </div>
      </div>
    </div>
  );
};
