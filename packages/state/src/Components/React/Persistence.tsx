import { observable } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { reactive, Reactive } from "@legendapp/state/react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Editor } from "shared/src/Components/Editor/Editor";

export const Footer = ({
  className,
  theme,
  children,
  width,
  center,
}: {
  className?: string;
  theme?: "light" | "dark";
  center?: boolean;
  children: any;
  width?: number;
}) => {
  return (
    <div
      className={classNames(
        "rounded-lg p-4",
        center && "flex flex-col items-center",
        theme === "light" ? "bg-gray-50 text-gray-900" : "bg-gray-800",
        className
      )}
      style={{ width }}
    >
      {children}
    </div>
  );
};


const PERSISTENCE_CODE = `
import { observable } from "@legendapp/state"
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"
import { syncObservable } from "@legendapp/state/sync"
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"
import { reactive, Reactive } from "@legendapp/state/react"
import { motion } from "framer-motion"
import { useRef } from "react"

enableReactComponents()

const state$ = observable({
  settings: { showSidebar: false, theme: 'light' },
  user: {
    profile: { name: '', avatar: '' },
    messages: {}
  }
})

// Persist state
syncObservable(state$, {
  local: 'persistenceExample',
  pluginLocal: ObservablePersistLocalStorage,
})

// Create a reactive Framer-Motion div
const MotionDiv = reactive(motion.div)

function App() {
  const renderCount = ++useRef(0).current

  const sidebarHeight = () => (
    state$.settings.showSidebar.get() ? 96 : 0
  )

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <div>Username:</div>
      <Reactive.input
        className="input"
        $value={state$.user.profile.name}
      />
      <Button onClick={state$.settings.showSidebar.toggle}>
        Toggle footer
      </Button>
      <MotionDiv
        className="footer"
        $animate={() => ({
           height: state$.settings.showSidebar.get() ?
             96 : 0
        })}
      >
        <div className="p-4">Footer</div>
      </MotionDiv>
    </Box>
  )
}
`;

export function PersistenceComponent() {
  return (
    <Editor
      code={PERSISTENCE_CODE}
      scope={{
        useRef,
        observable,
        syncObservable,
        enableReactComponents,
        ObservablePersistLocalStorage,
        reactive,
        motion,
        Reactive,
        Button,
        Box,
      }}
      noInline={true}
      previewWidth={210}
      renderCode=";render(<App />)"
      transformCode={(code) =>
        code
          .replace(
            /className="footer"/g,
            'className="bg-gray-600 text-center text-white text-sm overflow-hidden"'
          )
          .replace(
            /className="input"/g,
            'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2"'
          )
      }
    />
  );
}
