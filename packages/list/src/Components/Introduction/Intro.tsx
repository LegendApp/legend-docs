import { observable, observe } from '@legendapp/state';
import { observer, use$ } from '@legendapp/state/react';
import classNames from 'classnames';
import { Box } from 'shared/src/Components/Box';
import { Button } from 'shared/src/Components/Button';
import { Editor } from 'shared/src/Components/Editor/Editor';

const INTRO_EXAMPLE_CODE = `
import { observable } from "@legendapp/state"
import { use$ } from "@legendapp/state/react"

// Create an observable object
const settings$ = observable({ theme: 'dark' })

// This is the code for the example on your right ----->
function Component() {
  // theme is automatically tracked for changes
  const theme = use$(settings$.theme)

  const toggle = () => {
    settings$.theme.set(theme =>
      theme === 'dark' ? 'light' : 'dark'
    )
  }

  return (
    <Box theme={theme}>
      <div>Theme: {theme}</div>
      <Button theme={theme} onClick={toggle}>
        Toggle theme
      </Button>
    </Box>
  )
}
`;

export function IntroExampleComponent() {
    return (
        <Editor
            code={INTRO_EXAMPLE_CODE}
            scope={{
                observable,
                observer,
                classNames,
                observe,
                Button,
                Box,
                use$,
            }}
            noInline
            renderCode=";render(<Component />)"
            previewWidth={180}
        />
    );
}
