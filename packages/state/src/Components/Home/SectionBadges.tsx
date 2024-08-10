import { Badges } from "./Badges";
import { Header } from "./Header";
import { Text } from "./Text";

export function SectionBadges() {
  const badges = [
    { title: "📚  App State", subtitle: "Local and global" },
    { title: "☁️  Remote State", subtitle: "Sync with any backend" },
    { title: "💾  Persistence", subtitle: "Both web and mobile" },
    { title: "😀  Best DX", subtitle: "Easy and fun" },
    { title: "🚀  Fast", subtitle: "#1 in performance" },
  ];

  return (
    <div className="text-center pt-16 !mt-0">
      <Header size="h1">All in One</Header>
      <Text className="max-w-lg mx-auto">
        Legend-State is the fastest React state library, and it takes care of all of the hard sync and caching stuff for you.
      </Text>
      <Badges badges={badges} className={"!mt-8"} />
    </div>
  );
}

//   const badges = [
//     { title: "Fine Grained Reactivity", subtitle: "for maximum performance" },
//     { title: "React", subtitle: "2kb" },
//     { title: "Sync", subtitle: "with any backend" },
//     { title: "Persistence", subtitle: "both web and mobile" },
//     { title: "Stars", subtitle: "2.6k+" },
//   ];
