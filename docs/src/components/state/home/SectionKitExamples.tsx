import { Header } from "./Header";
import { ListOfBoxes } from "./ListOfBoxes";
import { Text } from "./Text";

export function SectionKitExamples() {
  return (
    <div className="mt-subsection px-4">
      <Header size="h3">👩‍🏫 Example projects (Planned)</Header>
      <Text>
        Full open-source apps built with Legend-State that you can use as a
        starting point or for reference for best practices.
      </Text>
      <ListOfBoxes
        items={["JSON Viewer", "Trellix Clone", 'Chat app', "More..."]}
        className="!mt-8"
      />
    </div>
  );
}