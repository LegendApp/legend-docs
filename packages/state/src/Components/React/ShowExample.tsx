import { Show, useObservable } from "@legendapp/state/react";
import { useRef } from "react";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";

function Modal() {
    return (
        <div className="p-6 my-4 font-bold text-center bg-gray-700 rounded-lg shadow">Modal</div>
    )
}
function Nothing() {
    return <div className="text-xs text-gray-500">Nothing to see here</div>
}

const SHOW_EXAMPLE_CODE = `
import { Show, useObservable } from "@legendapp/state/react";
import { useRef } from "react";

const ShowExample = () => {
  const renderCount = ++useRef(0).current;
  const state = useObservable({ show: false });

  return (
    <Box width={160}>
      <div>Renders: {renderCount}</div>
      <Button
        onClick={state.show.toggle}
      >
        Toggle
      </Button>
      <Show if={state.show} else={<Nothing />}>
        {() => <Modal />}
      </Show>
    </Box>
  );
}
`;

export function ShowComponent() {
  return (
    <Editor
      code={SHOW_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        Show,
        Box,
        Button,
        Modal,
        Nothing,
      }}
      noInline={true}
      previewWidth={160}
      renderCode=";render(<ShowExample />)"
    />
  );
}
