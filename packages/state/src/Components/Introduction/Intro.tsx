import { observable, observe } from "@legendapp/state";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import classNames from "classnames";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";

const INTRO_EXAMPLE_CODE = `
// Automatically re-render components when observables change
enableReactTracking({ auto: true })

// Create an observable object
const settings$ = observable({ theme: 'dark' })

// This is the code for the example on your right ----->
function Component() {
  // theme is automatically tracked for changes
  const theme = settings$.theme.get()

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
        classNames,
        observe,
        Button,
        enableReactTracking,
        Box,
      }}
      noInline
      renderCode=";render(<Component />)"
      previewWidth={180}
      transformCode={(code) => code.replace('zzz', '')}
    />
  );
}
