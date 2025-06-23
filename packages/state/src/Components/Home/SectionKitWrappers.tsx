import { Header } from "./Header";
import { ListOfBoxes } from "./ListOfBoxes";
import { Text } from "./Text";

export function SectionKitWrappers() {
  const items = [
    "NativeWind UI",
    "Tailwind UI",
    "shadcn",
    "Gluestack",
    "Tamagui",
    "Mantine",
    "Chakra UI",
    "NextUI",
    "PrimeReact",
    "More...",
  ];

  return (
    <div className="mt-subsection px-4">
      <Header size="h3">🤗 Reactive Components for your favorite UI kit (Planned)</Header>
      <Text>Augment your UI kit with reactive props and two-way binding.</Text>
      <ListOfBoxes
        items={items}
        className="!mt-8"
      />
    </div>
  );
}
