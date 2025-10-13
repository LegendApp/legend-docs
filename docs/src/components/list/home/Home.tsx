'use client';

import '@/styles/state-editor.css';
import React from 'react';
import { HeroSection } from './HeroSection';
import { MigrationSection } from './MigrationSection';
import { LazyListSection } from './LazyListSection';
import { PowerfulListsSection } from './AIChatSection';
import { PlatformSection } from './PlatformSection';
import { TalksSection } from './TalksSection';
import { CTASection } from './CTASection';

const ListHomePage = () => {
    return (
        <div id="scroller" className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col text-white">
            <div className="fixed inset-0 bg-[#0d1117]" />
            <main className="z-10 flex-grow">
                {/* 1. Video of performance at the top under the headline */}
                <HeroSection />
                
                {/* 2. Simple to switch from FlatList */}
                <MigrationSection />
                
                {/* 3. Lazy list (where we pass children instead of renderItem) */}
                <LazyListSection />
                
                {/* 4. Built for powerful lists (with a video of AI chat) */}
                <PowerfulListsSection />
                
                {/* 5. Works on all platforms */}
                <PlatformSection />
                
                {/* 6. Links to talks */}
                <TalksSection />
                
                {/* Call to action */}
                <CTASection />
                
                {/* Footer spacer */}
                <div className="h-20"></div>
            </main>
        </div>
    );
};

export default ListHomePage;