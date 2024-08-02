import React from 'react';

interface PackageSize {
  name: string;
  size: string;
}


export const SectionBadges: React.FC = () => {
  const sizes = [
    { name: "Core", size: "4kb" },
    { name: "React", size: "4kb" },
    { name: "Sync", size: "3kb" },
    { name: "Tests", size: "800+" },
    { name: "Stars", size: "2.6k+" },
  ];


  return (
    <div className="flex justify-center mt-16">
      <div className="flex justify-center border border-white/15 rounded-lg divide-x divide-white/15 shadow-dark">
        {sizes.map((pkg) => (
          <div key={pkg.name} className="!mt-0 px-8 py-2 text-center">
            <div className="text-lg font-bold text-white mb-1">{pkg.name}</div>
            <span className="text-md text-white/80">{pkg.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
