import classNames from "classnames";
import { Header } from "./Header";
import { Text } from "./Text";

export function SectionBadges() {
  const badges = [
    { title: "📚  App State", subtitle: "Local and global" },
    { title: "☁️  Remote State", subtitle: "Sync with any backend" },
    { title: "💾  Persistence", subtitle: "Both web and mobile" },
    { title: "😀  Great DX", subtitle: "Easy and intuitive" },
    { title: "🚀  Fast", subtitle: "#1 in performance" },
    { title: "⚡️  Fine-Grained", subtitle: "Reactivity" },
  ];

  return (
    <div className="text-center pt-16 !mt-0">
      <Header size="h1">All in One</Header>
      <Text className="max-w-lg mx-auto text-left">
        Legend-State is the fastest React state library, and it takes care of
        all of the hard sync and caching stuff for you.
      </Text>
      <Badges badges={badges} className={"!mt-8"} />
    </div>
  );
}

interface PropsBadges {
  badges: { title: string; subtitle?: string }[];
  titleSize?: `text-${string}`;
  titleWeight?: `font-${string}`;
  className?: string;
}

const Badges = ({ badges, titleSize, titleWeight, className }: PropsBadges) => {
  return (
    <div className={classNames("flex justify-center max-w-5xl", className)}>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:flex justify-center border bg-tBg border-tBorder rounded-lg divide-x divide-tBorder shadow-tShadowDark backdrop-blur-sm bg-opacity-0">
        {badges.map(({ title, subtitle }, i) => (
          <div
            key={title}
            className={classNames("!mt-0 px-3 sm:px-8 py-3 lg:py-4 text-center whitespace-pre", i === 5 && 'xl:hidden', i > 1 && 'border-t border-tBorder lg:border-0')}
          >
            <div
              className={classNames(
                "text-white",
                titleSize || "text-lg",
                titleWeight || "font-bold"
              )}
            >
              {title}
            </div>
            {subtitle && (
              <div className="text-sm sm:text-md text-white/60 pt-1 !mt-0">{subtitle}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};