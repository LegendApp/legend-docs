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
    <div className="mt-subsection px-4">
      <Header size="h3">🧑‍💻 VS Code Extension (Planned)</Header>
      <Text>
        A contextually aware coding assistant to accelerate your development speed.
      </Text>
      <div className="lg:flex items-center gap-4 pt-4">
        <FeatureGrid />
        <motion.div
          className="!mt-8 lg:!mt-0 max-w-full bg-tBg border border-tBorder flex justify-center items-center rounded-lg shadow-tShadowDark cursor-pointer relative overflow-hidden mx-auto"
          style={{ width: 480, height: 300 }}
          onClick={isOpen$.toggle}
          layout
          layoutId="video-container"
          transition={TransitionSpringFast}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/LegendKitExtension.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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
              className="w-[1280px] h-auto max-h-[95%] max-w-[95%] bg-tBg border border-tBorder flex justify-center items-center rounded-lg shadow-tShadowDark overflow-hidden"
              layoutId="video-container"
              transition={TransitionSpringFast}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              >
                <source src="/assets/LegendKitExtension.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
          className="p-4 border rounded-lg border-tBorder shadow-tShadowDark bg-tBg !mt-0"
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