import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import {
  reactive,
  useObservable,
  Switch,
  Show,
  useComputed,
} from "@legendapp/state/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { observable } from "@legendapp/state";
import { AnimatePresence } from "framer-motion";
import { Editor } from "shared/src/Components/Editor/Editor";

const MODAL_CODE = `
const MotionDiv = reactive(motion.div)
const MotionButton = reactive(motion.button)

const TransitionBounce = {
  type: 'spring',
  duration: 0.4,
  bounce: 0.3,
}

function Modal({ show }) {
  const renderCount = ++useRef(0).current
  const page = useObservable(0)

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => show.set(false)}
      />
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.7, translateY: 40 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ scale: 0.7, opacity: 0 }}
        style={{ width: 240, height: 320 }}
        transition={TransitionBounce}
      >
        <div>
          Renders: {renderCount}
        </div>
        <div className="pageText">
          <Switch value={page}>
            {{
              0: () => <div>First Page</div>,
              1: () => <div>Second Page</div>,
              2: () => <div>Third Page</div>
            }}
          </Switch>
        </div>
        <div className="modalButtons">
          <MotionButton
            className="pageButton"
            animate={() => ({ opacity: page.get() === 0 ? 0.5 : 1 })}
            $disabled={() => page.get() === 0}
            onClick={() => page.set(p => p - 1)}
            transition={{ duration: 0.15 }}
          >
            Prev
          </MotionButton>
          <MotionButton
            className="pageButton"
            animate={() => ({ opacity: page.get() === 2 ? 0.5 : 1 })}
            $disabled={() => page.get() === 2}
            onClick={() => page.set(p => p + 1)}
            transition={{ duration: 0.15 }}
          >
            Next
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  )
}


function App() {
  const renderCount = ++useRef(0).current

  const showModal = useObservable(false)

  return (
    <Box height={512}>
      <div>Renders: {renderCount}</div>
      <Button onClick={showModal.toggle}>
        Show modal
      </Button>
      <Show if={showModal} wrap={AnimatePresence}>
        {() => <Modal show={showModal} />}
      </Show>
    </Box>
  )
}
`;

export function ModalComponent() {
  return (
    <Editor
      code={MODAL_CODE}
      scope={{
        useRef,
        observable,
        reactive,
        motion,
        useObservable,
        Show,
        AnimatePresence,
        Switch,
        useComputed,
        Box,
        Button,
      }}
      noInline={true}
      renderCode=";render(<App />)"
      previewWidth={220}
      transformCode={(code) =>
        code
          .replace(
            /className="pageText"/g,
            'className="flex-1 flex justify-center items-center"'
          )
          .replace(
            /className="pageButton"/g,
            'className="px-4 py-2 my-4 font-bold rounded shadow text-2xs cursor-pointer bg-gray-600 hover:bg-gray-500 !mt-0"'
          )
          .replace(
            /className="modal"/g,
            'className="relative bg-gray-700 rounded-xl flex flex-col p-4"'
          )
          .replace(/className="modalButtons"/g, 'className="flex justify-center gap-4"')
      }
    />
  );
}

