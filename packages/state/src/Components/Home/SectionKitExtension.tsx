import { Header } from "./Header";
import { List } from "./List";
import { Text } from "./Text";

export function SectionKitExtension() {
  return (
    <div className="mt-subsection">
      <Header size="h3">🧑‍💻 VS Code Extension</Header>
      <p className="text-gray-400">
        Contextually aware helpers to quickly do common tasks for you
      </p>
      <div className="grid grid-cols-2">
        {/* <List
          items={[
            "Quick add for Legend-State features",
            "Smart component generation",
            "Auto imports",
            "Context-aware to know what you want",
          ]}
        /> */}
        <FeatureGrid />
        <p>Video</p>
      </div>
    </div>
  );
}

function FeatureGrid() {
  const features = [
    {
      title: "Quick Add",
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
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {features.map((feature, index) => (
        <div key={index} className="p-4 border rounded-lg t-border shadow-dark t-bg !mt-0">
          <Header size="h5" className="font-bold mb-2">
            {feature.title}
          </Header>
          <Text className="text-sm text-gray-300">{feature.description}</Text>
        </div>
      ))}
    </div>
  );
}
