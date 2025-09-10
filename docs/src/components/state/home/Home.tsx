'use client';

import { useObservable } from '@legendapp/state/react';
import '@/styles/state-editor.css';
import React, { useRef } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { AnimatedBackground } from './AnimatedBackground';
import { Header } from './Header';
import { Preorder } from './Preorder';
import { SectionBadges } from './SectionBadges';
import { SectionEasy } from './SectionEasy';
import { SectionFullSync } from './SectionFullSync';
import { SectionKitComponents } from './SectionKitComponents';
import { SectionKitExamples } from './SectionKitExamples';
import { SectionKitExtension } from './SectionKitExtension';
import { SectionKitWrappers } from './SectionKitWrappers';
import { SectionPerfChart } from './SectionPerfChart';
import { SectionFineGrained } from './SectionReactivityPerf';
import { SectionSync } from './SectionSync';
import { SectionTop } from './SectionTop';
import { Text } from './Text';
import { BackgroundGradients } from './BackgroundGradients';
import { SectionKitHeader } from './SectionKitHeader';
import { Footer } from './Footer';
import { SectionKitCLI } from './SectionKitCLI';

const LandingPage = () => {
    const state$ = useObservable({ speed: 2 });
    const refKit = useRef<HTMLDivElement>(null);

    const onClickGotoKit = () => {
        refKit.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div id="scroller" className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col text-white">
            <div className="fixed inset-0 bg-[#0d1117]" />
            <main className="z-10 flex-grow">
                <div className="relative" id="background-container">
                    <div className="max-w-5xl mx-auto pt-28 px-4">
                        <AnimatedBackground state$={state$} />
                        <div className="max-w-3xl z-10 relative">
                            <Header size="h1" className="!leading-tight text-center md:text-left">
                                High performance state and local first sync
                            </Header>
                            <div className="max-w-2xl pt-2 pb-4">
                                <Text className="md:text-lg">
                                    Legend State is an extremely fast signal-based state library with fine-grained
                                    reactivity and a powerful sync system that works with any backend.
                                </Text>
                            </div>
                            <div className="flex flex-col xs:flex-row xs:gap-8 items-center">
                                <Link href="/state/v3/intro/introduction/" className="no-underline">
                                    <Button color="bg-blue-700/80 hover:bg-blue-600">Get started</Button>
                                </Link>
                                <div
                                    className="text-white/80 hover:text-white cursor-pointer font-medium bg-black/30 border border-white/10 shadow-tShadowDark xs:bg-none xs:shadow-none hover:bg-black/30 hover:shadow-tShadowDark px-4 h-10 rounded-lg transition-colors gap-3 flex items-center"
                                    onClick={onClickGotoKit}
                                >
                                    <div>Check out Legend Kit</div>
                                    <div>{'>'}</div>
                                </div>
                            </div>
                        </div>

                        <SectionTop state$={state$} />
                        <SectionBadges />
                    </div>
                </div>
                <div className="relative">
                    <BackgroundGradients />
                    <div className="max-w-5xl mx-auto relative pb-12">
                        <SectionFineGrained />
                        <SectionEasy />

                        <SectionPerfChart />

                        <SectionSync />
                        <SectionFullSync />
                        <div ref={refKit} />

                        <SectionKitHeader />

                        <SectionKitCLI />
                        <SectionKitComponents />
                        <SectionKitExtension />
                        <SectionKitWrappers />
                        <SectionKitExamples />
                        <Preorder />
                        <Footer />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
