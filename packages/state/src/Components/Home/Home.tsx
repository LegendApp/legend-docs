import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { useObservable } from "@legendapp/state/react";
import React from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { SectionTop } from "./SectionTop";
import { SectionPerf } from "./SectionPerf";
import { SectionSync } from "./SectionSync";
import { Button } from "shared/src/Components/Button";
import { SectionEasy } from "./SectionEasy";
import { SectionReact } from "./SectionReact";
import { SectionReactivityPerf } from "./SectionReactivityPerf";
import { SectionRPerfChart } from "./SectionPerfChart";
import { SectionReactivityComponents } from "./SectionReactivityComponents";
import { SectionLocalFirst } from "./SectionLocalFirst";
import { SectionKitComponents } from "./SectionKitComponents";
import { SectionKitExtension } from "./SectionKitExtension";
import { SectionKitWrappers } from "./SectionKitWrappers";
import { SectionKitExamples } from "./SectionKitExamples";
import { SectionKitDevTools } from "./SectionKitDevTools";
import { SectionBadges } from "./SectionBadges";
import { Header } from "./Header";
import { Text } from "./Text";
import { SectionFullSync } from "./SectionFullSync";

enableReactComponents();

const EnableKit = true;

const LandingPage: React.FC = () => {
  const state$ = useObservable({ speed: 1 });

  return (
    <div
      id="scroller"
      className="absolute inset-0 overflow-auto mt-11 flex flex-col text-white"
    >
      <div className="fixed inset-0 bg-[#0b0d0e]" />
      <main className="z-10 flex-grow">
        <div className="relative" id="background-container">
          <div className="max-w-5xl mx-auto pt-28 pb-16 px-4">
            <AnimatedBackground state$={state$} />
            <div className="max-w-3xl z-10 relative">
              <Header
                size="h1"
                fontWeight="!font-medium"
                className="!text-[3.25rem] tracking-tight"
              >
                Build blazing fast local-first apps with less code
              </Header>
              <div className="max-w-xl pt-2 pb-4">
                <Text>
                  It's fast by default with fine-grained reactivity, a powerful
                  sync system for any backend, and persistence plugins for web
                  and mobile."
                </Text>
              </div>
              <div className="flex gap-8 !mt-0 items-center">
                <Button color="bg-blue-700 hover:bg-blue-600">
                  Get started
                </Button>
                <div className="!mt-0 text-white/80 hover:text-white cursor-pointer font-medium hover:bg-gray-850 px-4 h-10 rounded-lg transition-colors gap-3 flex items-center">
                  <div>Check out Legend-Kit</div>
                  <div className="!mt-0">{">"}</div>
                </div>
              </div>
            </div>

            <SectionTop state$={state$} />
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          <SectionBadges />
          <SectionEasy />
          <SectionReact />

          <SectionRPerfChart />
          <SectionReactivityPerf />
          {/* <SectionReactivityComponents /> */}

          <SectionSync />
          <SectionFullSync />
          {/* <SectionLocalFirst /> */}

          {EnableKit && (
            <>
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                Legend Kit accelerates your development
              </h1>
              <p>Tools to help you get started and speed up development</p>

              <SectionKitComponents />
              <SectionKitExtension />
              <SectionKitWrappers />
              <SectionKitExamples />
              {/* <SectionKitDevTools /> */}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
