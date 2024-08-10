import { Badges } from "./Badges";
import { Header } from "./Header";

export function SectionBadges({ className }: { className: string }) {
  const badges = [
    { title: "✅  App State", subtitle: "Local and global" },
    { title: "☁️  Remote State", subtitle: "Sync with any backend" },
    { title: "💾  Persistence", subtitle: "Both web and mobile" },
    { title: "😀  Best DX", subtitle: "Easy and fun" },
    { title: "🚀  Fast", subtitle: "#1 in performance" },
  ];

  return (
    <div className="text-center pt-16 !mt-0">
      <Header size="h1">All in One</Header>
      <Badges badges={badges} className={className} />
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
