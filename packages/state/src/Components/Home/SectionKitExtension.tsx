import { observer, useObservable } from "@legendapp/state/react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { Header } from "./Header";
import { Text } from "./Text";

const TransitionSpringFast: Transition = {
  type: "spring",
  duration: 0.5,
  bounce: 0.2,
};

export const SectionKitExtension = observer(function SectionKitExtension() {
  const isOpen$ = useObservable(false);

  return (
    <div className="mt-subsection">
      <Header size="h3">🧑‍💻 VS Code Extension</Header>
      <Text>
        A contextually aware coding assistant to accelerate your development speed
      </Text>
      <div className="flex items-center gap-4 pt-4">
        <FeatureGrid />
        <motion.div
          className="t-bg border t-border flex justify-center items-center rounded-lg shadow-dark cursor-pointer !mt-0"
          style={{ width: 480, height: 270 }}
          onClick={isOpen$.toggle}
          layout
          layoutId="video-container"
          transition={TransitionSpringFast}
        >
          Video
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen$.get() && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isOpen$.toggle}
          >
            <motion.div
              className="h-[720px] w-[1280px] max-h-[95%] max-w-[95%] t-bg border t-border flex justify-center items-center rounded-lg shadow-dark"
              layoutId="video-container"
              transition={TransitionSpringFast}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Video (Expanded)
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function FeatureGrid() {
  const features = [
    {
      title: "Snippets",
      description: "Easily add Legend-State features by hotkey",
    },
    {
      title: "Smart Generation",
      description: "Quickly generate full components",
    },
    {
      title: "Auto Imports",
      description: "Automatically adds imports as needed",
    },
    {
      title: "Context-Aware Sidebar",
      description: "Quick access to tools most useful in any moment",
    },
    {
      title: "Linter",
      description: "Detect and fix common issues like missing observer",
    },
    {
      title: "Extensive Customization",
      description: "Customize to your workflow and create your own snippets",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 flex-1">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg t-border shadow-dark t-bg !mt-0"
        >
          <Header size="h5" className="font-bold mb-2">
            {feature.title}
          </Header>
          <Text className="text-sm text-gray-300">{feature.description}</Text>
        </div>
      ))}
    </div>
  );
}
