import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { useObservable } from "@legendapp/state/react";
import React, { useRef } from "react";
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
import classNames from "classnames";

enableReactComponents();

const EnableKit = true;

const LandingPage: React.FC = () => {
  const state$ = useObservable({ speed: 1 });
  const refKit = useRef<HTMLDivElement>(null);

  const onClickGotoKit = () => {
    refKit.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
                <div className="!mt-0 text-white/80 hover:text-white cursor-pointer font-medium hover:bg-black/30 hover:shadow-dark px-4 h-10 rounded-lg transition-colors gap-3 flex items-center" onClick={onClickGotoKit}>
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
          <div ref={refKit} />

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
      <LinearGradient top={800} height={3000} left="0" width={"100%"} />
      <LinearGradient top={3800} height={3000} left="0" width={"100%"} flip />
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
  const color = Math.round(255 * brightness);
  const hex = rgbToHex(color, color, color);
  return (
    <div
      className="absolute -z-10"
      style={{
        top,
        height,
        left,
        width,
        background: `
          radial-gradient(ellipse at center, ${hex} 0%, #0d1117 50%)
        `,
      }}
    ></div>
  );
}
function LinearGradient({
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

  return (
    <div
      className={classNames(
        "absolute -z-10 from-[#11141a] to-[#0d1117] !mt-0",
        flip ? "bg-gradient-to-b" : "bg-gradient-to-t"
      )}
      style={{
        top,
        height,
        left,
        width,
      }}
    ></div>
  );
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
