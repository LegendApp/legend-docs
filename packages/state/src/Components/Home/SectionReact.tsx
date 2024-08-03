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
    <div className="mt-section">
      <Header size="h2" className="text-center">
        ✨ Makes React fun, fast, and easy
      </Header>
      <div className="flex !mt-12 border-t-2 border-b-2 border-white/4">
        <div className="flex-1 py-12 pr-12">
          <div>
            <Header size="h4" className="font-medium text-white">
              Reactive components with observer
            </Header>
            <Text className="pb-4">
              You don't need any complicated selectors or anything. Just get an
              observable value and the component will re-render itself when it
              changes.
            </Text>
          </div>
          <DemoObserver />
        </div>
        <div className="flex-1 !mt-0 border-l-2 border-white/4 py-12 pl-12">
          <div>
            <Header size="h4" className="font-medium">
              Two-way binding
            </Header>
            <Text className="pb-4">
              No more change handlers, just bind observables to inputs. Reactive
              props simplify logic and optimize performance with the tiniest
              possible rerenders.
            </Text>
          </div>
          <DemoReactive />
        </div>
      </div>
    </div>
  );
};
