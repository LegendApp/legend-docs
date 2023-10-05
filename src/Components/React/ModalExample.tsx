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
import { Editor } from "../Editor/Editor";

const MODAL_CODE = `const MotionDiv = reactive(motion.div)
const MotionButton$ = reactive(motion.button)

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
        className="bg-black/60"
        onClick={() => show.set(false)}
      />
      <motion.div
        className="relative bg-white rounded-xl flex flex-col p-4"
        initial={{ opacity: 0, scale: 0.7, translateY: 40 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ scale: 0.7, opacity: 0 }}
        style={{ width: 240, height: 320 }}
        transition={TransitionBounce}
      >
        <div className="text-black text-sm">
          Renders: {renderCount}
        </div>
        <div className="flex-1 flex justify-center items-center text-black">
          <Switch value={page}>
            {{
              0: () => <div>First Page</div>,
              1: () => <div>Second Page</div>,
              2: () => <div>Third Page</div>
            }}
          </Switch>
        </div>
        <div className="flex justify-center gap-4">
          <MotionButton$
            className="bg-orange-300 rounded-lg px-6 py-2"
            animate={() => ({ opacity: page.get() === 0 ? 0.5 : 1 })}
            $disabled={() => page.get() === 0}
            onClick={() => page.set(p => p - 1)}
            transition={{ duration: 0.15 }}
          >
            Prev
          </MotionButton$>
          <MotionButton$
            className="bg-orange-300 rounded-lg px-6 py-2"
            animate={() => ({ opacity: page.get() === 2 ? 0.5 : 1 })}
            $disabled={() => page.get() === 2}
            onClick={() => page.set(p => p + 1)}
            transition={{ duration: 0.15 }}
          >
            Next
          </MotionButton$>
        </div>
      </motion.div>
    </motion.div>
  )
}


function App() {
  const renderCount = ++useRef(0).current

  const showModal = useObservable(false)

  return (
    <div className="p-4 bg-slate-800 h-[32rem]">
      <div className="text-white text-sm pb-4">
        Renders: {renderCount}
      </div>
      <button
        className="bg-orange-300 rounded-lg px-4 py-2"
        onClick={showModal.toggle}
      >
        Show modal
      </button>
      <Show if={showModal} wrap={AnimatePresence}>
        {() => <Modal show={showModal} />}
      </Show>
    </div>
  )
}

render(<App />)
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
      }}
    />
  );
}
