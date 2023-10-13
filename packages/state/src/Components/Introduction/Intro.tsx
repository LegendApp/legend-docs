import { observable, observe } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { persistObservable } from "@legendapp/state/persist";
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { Editor } from "shared/src/Components/Editor/Editor";
import classNames from "classnames";

const Button = ({
  onClick,
  theme,
  children,
}: {
  theme: "light" | "dark";
  onClick: () => void;
  children: any;
}) => {
  return (
    <button
      className={classNames(
        "block px-4 py-2 my-4 font-bold rounded shadow text-2xs cursor-pointer bg-gray-600 hover:bg-gray-500",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Box = ({
  className,
  theme,
  children,
}: {
  className: string;
  theme: "light" | "dark";
  children: any;
}) => {
  console.log(className);
  return (
    <button
      className={classNames(
        "rounded-lg p-4",
        theme === "dark" ? "bg-gray-800" : "bg-gray-50 text-gray-900",
        className
      )}
    >
      {children}
    </button>
  );
};

const INTRO_EXAMPLE_CODE = `
import { observable, observe } from "@legendapp/state"
import { persistObservable } from "@legendapp/state/persist"

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

// Automatically persist state$. Refresh this page to try it.
persistObservable(state$, { local: 'exampleState' })

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
        observer,
        observe,
        persistObservable,
        Button,
        enableReactTracking,
        Box,
      }}
      noInline
      renderCode=";render(<Component />)"
      previewWidth={180}
    />
  );
}
