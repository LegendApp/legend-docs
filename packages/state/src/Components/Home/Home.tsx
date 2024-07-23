import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { useObservable } from "@legendapp/state/react";
import React from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { SectionEasy } from "./SectionEasy";
import { SectionPerf } from "./SectionPerf";
import { SectionSync } from "./SectionSync";

enableReactComponents();



const LandingPage: React.FC = () => {
  const state$ = useObservable({ name: "", speed: 1 });

  return (
    <div id="scroller" className="absolute inset-0 overflow-auto mt-11 flex flex-col text-white font-sans">
      <AnimatedBackground state$={state$} />
      <main className="z-10 flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Build faster apps faster</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Legend-State is a super fast all-in-one state and sync library
              that lets you write less code to make faster apps.
            </p>
          </div>
          <SectionEasy state$={state$} />
          <SectionPerf />
          <SectionSync />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
