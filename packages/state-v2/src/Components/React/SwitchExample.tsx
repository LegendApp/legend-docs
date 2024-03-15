import { Switch, useObservable } from "@legendapp/state/react";
import { useRef } from "react";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";

const SWITCH_EXAMPLE_CODE = `
import { Switch, useObservable } from "@legendapp/state/react"
import { useRef } from "react"

function SwitchExample() {
  const renderCount = ++useRef(0).current
  const index$ = useObservable(0)

  const onClick = () => index$.set((v) => (v > 2 ? 0 : v + 1))

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <Button onClick={onClick}>
        Next tab
      </Button>
      <Switch value={index$}>
        {{
          0: () => <div>Tab 1</div>,
          1: () => <div>Tab 2</div>,
          2: () => <div>Tab 3</div>,
          3: () => <div>Error</div>,
        }}
      </Switch>
    </Box>
  )
}
`;

export function SwitchComponent() {
  return (
    <Editor
      code={SWITCH_EXAMPLE_CODE}
      scope={{
        useRef,
        useObservable,
        Switch,
        Box,
        Button,
      }}
      noInline={true}
      previewWidth={160}
      renderCode=";render(<SwitchExample />)"
    />
  );
}
