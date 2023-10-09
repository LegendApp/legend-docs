import { useRef } from "react";
import { Editor } from "../Editor/Editor";
import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { reactive, Reactive } from "@legendapp/state/react";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { motion } from "framer-motion";

const PERSISTENCE_CODE = `enableReactComponents();

const State = observable({
  settings: {
    showSidebar: false,
    theme: 'light'
  },
  user: {
    profile: {
      name: '',
      avatar: ''
    },
    messages: {}
  }
})

// Persist state
persistObservable(State, {
  local: 'example',
  persistLocal: ObservablePersistLocalStorage,
})

// React Component
const MotionDiv = reactive(motion.div);
const classNameInput = "bg-white border rounded border-gray-300 px-2 py-1 mt-2 text-black";

function App() {
  const renderCount = ++useRef(0).current;

  return (
    <div className="bg-white">
      <div className="flex">
        <MotionDiv
          className="bg-gray-600 text-center pt-2 text-white text-sm"
          $initial={() => ({
              width: State.settings.showSidebar.get() ? 96 : 0
          })}
          $animate={() => ({
              width: State.settings.showSidebar.get() ? 96 : 0
          })}
        >
          Sidebar
        </MotionDiv>
        <div className="flex-1 p-4">
          <div className="text-black text-md pb-4">Renders: {renderCount}</div>
          <div className="text-black">Username:</div>
          <Reactive.input
            className={classNameInput}
            $value={State.user.profile.name}
          />
          <div>
            <button
              className="bg-gray-300 rounded-lg px-4 py-2 mt-6 text-black"
              onClick={State.settings.showSidebar.toggle}
            >
              Toggle sidebar
            </button>
          </div>
          <div>
            <button
              className="bg-gray-300 rounded-lg px-4 py-2 mt-6 text-black"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

render(<App />)
`;

export function PersistenceComponent() {
  return (
    <Editor
      code={PERSISTENCE_CODE}
      scope={{
        useRef,
        observable,
        persistObservable,
        enableReactComponents,
        ObservablePersistLocalStorage,
        reactive,
        motion,
        Reactive,
      }}
      noInline={true}
    />
  );
}
