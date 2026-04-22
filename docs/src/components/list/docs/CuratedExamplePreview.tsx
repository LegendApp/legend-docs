'use client';

import React from 'react';

import { ActivityHistoryExample } from '@/components/list/example-web/curated/ActivityHistoryExample';
import { AiChatExample } from '@/components/list/example-web/curated/AiChatExample';
import { CardsFeedExample } from '@/components/list/example-web/curated/CardsFeedExample';
import { ChatExample } from '@/components/list/example-web/curated/ChatExample';
import { DirectoryExample } from '@/components/list/example-web/curated/DirectoryExample';
import { GalleryGridExample } from '@/components/list/example-web/curated/GalleryGridExample';
import { InfiniteCalendarExample } from '@/components/list/example-web/curated/InfiniteCalendarExample';
import { MediaRailsExample } from '@/components/list/example-web/curated/MediaRailsExample';
import { NotificationsInboxExample } from '@/components/list/example-web/curated/NotificationsInboxExample';
import { ProductShelfExample } from '@/components/list/example-web/curated/ProductShelfExample';
import { SectionedDirectoryExample } from '@/components/list/example-web/curated/SectionedDirectoryExample';
import { VideoFeedExample } from '@/components/list/example-web/curated/VideoFeedExample';
import type { ExampleSlug } from '@/components/list/examples-shared/catalog';

import type { ExampleVariant } from './exampleDocsData';

type Props = {
    showTitle?: boolean;
    slug: ExampleSlug;
    variant?: ExampleVariant;
};

export function CuratedExamplePreview({ showTitle = false, slug, variant = 'default' }: Props) {
    switch (slug) {
        case 'chat':
            return <ChatExample playground={variant === 'playground'} showTitle={showTitle} />;
        case 'ai-chat':
            return <AiChatExample showTitle={showTitle} />;
        case 'directory':
            return <DirectoryExample showTitle={showTitle} />;
        case 'sectioned-directory':
            return <SectionedDirectoryExample showTitle={showTitle} />;
        case 'product-shelf':
            return <ProductShelfExample showTitle={showTitle} />;
        case 'cards-feed':
            return <CardsFeedExample showTitle={showTitle} />;
        case 'media-rails':
            return <MediaRailsExample showTitle={showTitle} />;
        case 'video-feed':
            return <VideoFeedExample showTitle={showTitle} />;
        case 'notifications-inbox':
            return <NotificationsInboxExample showTitle={showTitle} />;
        case 'activity-history':
            return <ActivityHistoryExample showTitle={showTitle} />;
        case 'gallery-grid':
            return <GalleryGridExample showTitle={showTitle} />;
        case 'infinite-calendar':
            return <InfiniteCalendarExample showTitle={showTitle} />;
        default:
            return null;
    }
}
