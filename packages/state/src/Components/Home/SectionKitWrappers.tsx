import { Badges } from "./Badges";
import { Header } from "./Header";
import { Text } from "./Text";

export function SectionKitWrappers() {
  const badges = [
    { title: "NativeWind UI" },
    { title: "Gluestack" },
    { title: "Tamagui" },
  ];

  return (
    <div>
      <Header size="h3">3. Reactive Components for your favorite UI kit</Header>
      <Text>Augment your UI kit with reactive props and two-way binding</Text>
      <Badges badges={badges} titleSize="text-md" titleWeight="font-medium" />
    </div>
  );
}
