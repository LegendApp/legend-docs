import { reactive } from "@legendapp/state/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { observable } from "@legendapp/state";
import { useComputed, Memo } from "@legendapp/state/react";
import { Editor } from "../Editor/Editor";

const ANIMATED_SWITCH_CODE = `const MotionDiv = reactive(motion.div)

function Toggle({ value }) {
  return (
    <MotionDiv
      className="border border-gray-200 rounded-full select-none"
      $animate={() => ({
        backgroundColor: value.get() ? '#6ACB6C' : '#C4D1E3'
      })}
      style={{ width: 64, height: 32 }}
      onClick={value.toggle}
    >
      <MotionDiv
        className="bg-white rounded-full shadow"
        style={{ width: 24, height: 24, marginTop: 3 }}
        $animate={() => ({
          x: value.get() ? 32 : 6
        })}
      />
    </MotionDiv>
  )
}

const settings = observable({ enabled: false })

function App() {
  const renderCount = ++useRef(0).current

  // Computed text value
  const text = useComputed(() =>
    settings.enabled.get() ? 'Yes' : 'No'
  )

  return (
    <div className="p-4 bg-slate-800">
      <div className="text-gray-500 text-sm">
        Renders: {renderCount}
      </div>
      <div className="pt-8 pb-4">
        Enabled: <Memo>{text}</Memo>
      </div>
      <Toggle value={settings.enabled} />
    </div>
  )
}

render(<App />)
`;

export function AnimatedSwitchComponent() {
  return (
    <Editor
      code={ANIMATED_SWITCH_CODE}
      scope={{
        useRef,
        observable,
        reactive,
        motion,
        useComputed,
        Memo,
      }}
      noInline={true}
    />
  );
}
