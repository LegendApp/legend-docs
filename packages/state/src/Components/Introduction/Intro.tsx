import { observable, observe } from "@legendapp/state";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import classNames from "classnames";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";

const INTRO_EXAMPLE_CODE = `
// Create an observable object
const state$ = observable({ settings: { theme: 'dark' } })

// get() returns the raw data
state$.settings.theme.get() === 'dark'

// observe re-runs when any observables change
observe(() => {
  console.log(state$.settings.theme.get())
})

// Assign to state$ with set
state$.settings.theme.set('light')

// Automatically re-render components when observables change
enableReactTracking({ auto: true })

// This is the code for the example on your right ----->
function Component() {
  // theme is automatically tracked for changes
  const theme = state$.settings.theme.get()

  const toggle = () => {
    state$.settings.theme.set(theme =>
      theme === 'dark' ? 'light' : 'dark'
    )
  }

  return (
    <Box theme={theme}>
      <div>Theme: {theme}</div>
      <Button
        theme={theme}
        onClick={toggle}
      >
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
