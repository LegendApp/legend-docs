import React from "react";
import { Badges } from "./Badges";


export const SectionBadges: React.FC = () => {
  const badges = [
    { title: "Core", subtitle: "4kb" },
    { title: "React", subtitle: "4kb" },
    { title: "Sync", subtitle: "3kb" },
    { title: "Tests", subtitle: "800+" },
    { title: "Stars", subtitle: "2.6k+" },
  ];

  return <Badges badges={badges} />;
};
