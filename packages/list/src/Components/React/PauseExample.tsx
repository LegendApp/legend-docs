import {
  Memo,
  useObservable,
  usePauseProvider,
} from "@legendapp/state/react";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";
import { useInterval } from "usehooks-ts";

const MEMO_CODE = `
import { useInterval } from "usehooks-ts"
import { Memo, usePauseProvider, useObservable } from '@legendapp/state/react'

function App() {
    const { PauseProvider, isPaused$ } = usePauseProvider()

    const int$ = useObservable(0)
    useInterval(() => {
        int$.set((val) => val + 1)
    }, 100)

    return (
        <Box center>
            <Button onClick={isPaused$.toggle}>
                <Memo>{() => (isPaused$.get() ? 'Resume' : 'Pause')}</Memo>
            </Button>
            <PauseProvider>
                <Memo>{int$}</Memo>
            </PauseProvider>
        </Box>
    )
}
`;

export function PauseExampleComponent() {
  return (
    <Editor
      code={MEMO_CODE}
      scope={{
        Box,
        useObservable,
        Memo,
        useInterval,
        Button,
        usePauseProvider,
      }}
      noInline
      previewWidth={140}
      renderCode=";render(<App />)"
    />
  );
}
