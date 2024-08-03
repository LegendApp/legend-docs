import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { useObservable } from "@legendapp/state/react";
import React from "react";
import { Button } from "shared/src/Components/Button";
import { AnimatedBackground } from "./AnimatedBackground";
import { Header } from "./Header";
import { Preorder } from "./Preorder";
import { SectionBadges } from "./SectionBadges";
import { SectionEasy } from "./SectionEasy";
import { SectionFullSync } from "./SectionFullSync";
import { SectionKitComponents } from "./SectionKitComponents";
import { SectionKitExamples } from "./SectionKitExamples";
import { SectionKitExtension } from "./SectionKitExtension";
import { SectionKitWrappers } from "./SectionKitWrappers";
import { SectionPerfChart } from "./SectionPerfChart";
import { SectionReact } from "./SectionReact";
import { SectionReactivityPerf } from "./SectionReactivityPerf";
import { SectionSync } from "./SectionSync";
import { SectionTop } from "./SectionTop";
import { Text } from "./Text";

enableReactComponents();

const EnableKit = true;

const LandingPage: React.FC = () => {
  const state$ = useObservable({ speed: 1 });

  return (
    <div
      id="scroller"
      className="absolute inset-0 overflow-auto flex flex-col text-white"
    >
      <div className="fixed inset-0 bg-[#0d1117]" />
      <main className="z-10 flex-grow pb-24 !mt-0">
        <div className="relative" id="background-container">
          <RadialGradients />
          <div className="max-w-5xl mx-auto pt-28 px-4 !mt-0 pb-24">
            <AnimatedBackground state$={state$} />
            <div className="max-w-3xl z-10 relative">
              <Header size="h1" className="!text-[3.25rem] !leading-tight">
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
                <a href="/open-source/state/v3/intro/introduction/">
                  <Button color="bg-blue-700/80 hover:bg-blue-600">
                    Get started
                  </Button>
                </a>
                <div className="!mt-0 text-white/80 hover:text-white cursor-pointer font-medium hover:bg-black/50 px-4 h-10 rounded-lg transition-colors gap-3 flex items-center">
                  <div>Check out Legend-Kit</div>
                  <div className="!mt-0">{">"}</div>
                </div>
              </div>
            </div>

            <SectionTop state$={state$} />
          </div>
        </div>
        <div className="max-w-5xl mx-auto !mt-0">
          <SectionBadges className="pt-0" />
          <SectionEasy />
          <SectionReact />

          <SectionPerfChart />
          <SectionReactivityPerf />
          {/* <SectionReactivityComponents /> */}

          <SectionSync />
          <SectionFullSync />
          {/* <SectionLocalFirst /> */}

          {EnableKit && (
            <div className="mt-section">
              <Header
                size="h1"
                className="!text-[3.25rem] !leading-tight max-w-xl"
              >
                Get started faster with Legend Kit
              </Header>
              <Text>
                Tons of tools to increase your development speed and reduce the
                code you have to write.
              </Text>

              <SectionKitComponents />
              <SectionKitExtension />
              <SectionKitWrappers />
              <SectionKitExamples />
              {/* <SectionKitDevTools /> */}
              <Preorder />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

function RadialGradients() {
  return (
    <>
      <RadialGradient top={800} height={3000} left="-100%" width={"200%"} />
      <RadialGradient top={4000} height={3000} left="0" width={"200%"} />
    </>
  );
}
function RadialGradient({
  top,
  height,
  left,
  width,
  flip,
}: {
  top: number;
  height: number;
  left: number | string;
  width: number | string;
  flip?: boolean;
}) {
  const brightness = 0.04;
  return (
    <div
      className="absolute -z-10"
      style={{
        top,
        height,
        left,
        width,
        background: `
          radial-gradient(ellipse at center, rgba(255, 255, 255, ${brightness}) 0%, rgba(255, 255, 255, 0) 80%)
        `,
      }}
    ></div>
  );
}
