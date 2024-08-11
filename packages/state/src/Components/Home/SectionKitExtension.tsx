import { observer, useObservable } from "@legendapp/state/react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { Header } from "./Header";
import { Text } from "./Text";
import videoSrc from "../../assets/LegendKitExtension.mp4";
import videoFirstFrame from "../../assets/LegendKitExtension.png?url";

const TransitionSpringFast: Transition = {
  type: "spring",
  duration: 0.5,
  bounce: 0.2,
};

export const SectionKitExtension = observer(function SectionKitExtension() {
  const isOpen$ = useObservable(false);

  return (
    <div className="mt-subsection px-4">
      <Header size="h3">🧑‍💻 VS Code Extension</Header>
      <Text>
        A contextually aware coding assistant to accelerate your development
        speed
      </Text>
      <div className="lg:flex items-center gap-4 pt-4">
        <FeatureGrid />
        <motion.div
          className="!mt-8 lg:!mt-0 t-bg border t-border flex justify-center items-center rounded-lg shadow-dark cursor-pointer relative overflow-hidden mx-auto"
          style={{ width: 480, height: 270 }}
          onClick={isOpen$.toggle}
          layout
          layoutId="video-container"
          transition={TransitionSpringFast}
        >
          <img
            src={videoFirstFrame}
            alt="VS Code Extension"
            width="100%"
            height="100%"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-black"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
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
              className="w-[1280px] h-auto  max-h-[95%] max-w-[95%] t-bg border t-border flex justify-center items-center rounded-lg shadow-dark overflow-hidden"
              layoutId="video-container"
              transition={TransitionSpringFast}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <video
                src={videoSrc}
                controls
                width="100%"
                height="100%"
                autoPlay
              />
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