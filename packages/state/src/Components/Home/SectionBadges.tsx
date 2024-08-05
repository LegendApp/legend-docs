import { Badges } from "./Badges";

export function SectionBadges ({ className }: { className: string}) {
  const badges = [
    { title: "Core", subtitle: "8kb" },
    { title: "React", subtitle: "2kb" },
    { title: "Sync", subtitle: "4kb" },
    { title: "Tests", subtitle: "800+" },
    { title: "Stars", subtitle: "2.6k+" },
  ];

  return <Badges badges={badges} className={className} />;
};
