import { reactive } from "@legendapp/state/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { observable } from "@legendapp/state";
import { useComputed, Memo } from "@legendapp/state/react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";

const ANIMATED_SWITCH_CODE = `
import { reactive } from "@legendapp/state/react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { observable } from "@legendapp/state"
import { useComputed, Memo } from "@legendapp/state/react"

const MotionDiv = reactive(motion.div)

function Toggle({ $value }) {
  return (
    <MotionDiv
      className="toggle"
      $animate={() => ({
        backgroundColor: $value.get() ? '#6ACB6C' : '#515153'
      })}
      style={{ width: 64, height: 32 }}
      onClick={$value.toggle}
    >
      <MotionDiv
        className="thumb"
        style={{ width: 24, height: 24, marginTop: 3 }}
        $animate={() => ({
          x: $value.get() ? 34 : 4
        })}
      />
    </MotionDiv>
  )
}

const settings$ = observable({ enabled: false })

function App() {
  const renderCount = ++useRef(0).current

  // Computed text value
  const text$ = () => (
    settings$.enabled.get() ? 'Yes' : 'No'
  )

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <div>
        Enabled: <Memo>{text$}</Memo>
      </div>
      <Toggle $value={settings$.enabled} />
    </Box>
  )
}
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
        Box,
        Button,
      }}
      noInline={true}
      renderCode=";render(<App />)"
      previewWidth={128}
      transformCode={(code) =>
        code
          .replace(
            /className="toggle"/g,
            'className="border border-[#717173] rounded-full select-none cursor-pointer"'
          )
          .replace(
            /className="thumb"/g,
            'className="bg-white rounded-full shadow"'
          )
      }
    />
  );
}
