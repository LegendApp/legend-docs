import { Header } from "./Header";
import { List } from "./List";
import { Text } from "./Text";

export function SectionKitExamples() {
  return (
    <div>
      <Header size="h3">4. Example projects</Header>
      <Text>
        Full open-source apps built with Legend-State that you can use as a
        starting point or for reference for best practices.
      </Text>
      <List items={["JSON Viewer", "Trellix Clone", "More..."]} />
    </div>
  );
}
