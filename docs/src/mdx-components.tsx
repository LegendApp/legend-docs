import { Editor } from '@/components/Editor';
import { ChatPlaygroundDemo } from '@/components/list/docs/ChatPlaygroundDemo';
import { HorizontalInfiniteCalendarDemo } from '@/components/list/docs/HorizontalInfiniteCalendarDemo';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        Editor,
        ChatPlaygroundDemo,
        HorizontalInfiniteCalendarDemo,
        ...components,
    };
}
