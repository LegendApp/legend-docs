import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { useMount, useObservable } from "@legendapp/state/react";
import React, { useMemo, useRef } from "react";
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
import { BackgroundGradients } from "./BackgroundGradients";
import { SectionKitHeader } from "./SectionKitHeader";

// function useScrollForHeader() {
//   useMount(() => {
//     const header = document.getElementsByTagName("header")[0];
//     // const scroller =
//     const handleScroll = () => {
//       const opacity = Math.min(document.documentElement.scrollTop / 200, 1);
//       const color = `rgba(0,0,0,${opacity})`;
//       header.style.setProperty("background-color", color, "important");
//     };

//     window.addEventListener("scroll", handleScroll);

//     // Initial call to set the initial scroll position
//     handleScroll();

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   });
// }

enableReactComponents();

const EnableKit = true;

const LandingPage = () => {
  const state$ = useObservable({ speed: 2 });
  const refKit = useRef<HTMLDivElement>(null);
//   useScrollForHeader();

  const onClickGotoKit = () => {
    refKit.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="scroller"
      className="absolute inset-0 overflow-auto flex flex-col text-white"
    >
      <div className="fixed inset-0 bg-[#0d1117]" />
      <main className="z-10 flex-grow !mt-0">
        <div className="relative" id="background-container">
          <div className="max-w-5xl mx-auto pt-28 px-4 !mt-0">
            {/* <AnimatedBackground state$={state$} /> */}
            <div className="max-w-3xl z-10 relative">
              <Header
                size="h1"
                className="md:!text-[3.5rem] !font-bold !leading-tight text-center md:text-left"
              >
                High performance state and local-first sync
              </Header>
              <div className="max-w-2xl pt-2 pb-4">
                <Text className="md:text-lg">
                  Legend State is an extremely fast signal-based state library
                  with fine-grained reactivity and a powerful sync system that
                  works with any backend.
                </Text>
              </div>
              <div className="flex gap-8 !mt-0 items-center">
                <a
                  href="/open-source/state/v3/intro/introduction/"
                  className="no-underline"
                >
                  <Button color="bg-blue-700/80 hover:bg-blue-600">
                    Get started
                  </Button>
                </a>
                <div
                  className="!mt-0 text-white/80 hover:text-white cursor-pointer font-medium hover:bg-black/30 hover:shadow-dark px-4 h-10 rounded-lg transition-colors gap-3 flex items-center"
                  onClick={onClickGotoKit}
                >
                  <div>Check out Legend-Kit</div>
                  <div className="!mt-0">{">"}</div>
                </div>
              </div>
            </div>

            <SectionTop state$={state$} />
            <SectionBadges />
          </div>
        </div>
        <div className="!mt-0 relative">
          <BackgroundGradients />
          <div className="max-w-5xl mx-auto !mt-0 relative pb-24">
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
              <>
                <SectionKitHeader />

                <SectionKitComponents />
                <SectionKitExtension />
                <SectionKitWrappers />
                <SectionKitExamples />
                {/* <SectionKitDevTools /> */}
                <Preorder />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
