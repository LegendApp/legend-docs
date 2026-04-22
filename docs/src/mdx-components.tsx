import { Editor } from '@/components/Editor';
import { LegendListCuratedExamplePage } from '@/components/list/docs/LegendListCuratedExamplePage';
import { LegendListCuratedExamplesIndex } from '@/components/list/docs/LegendListCuratedExamplesIndex';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        Editor,
        LegendListCuratedExamplePage,
        LegendListCuratedExamplesIndex,
        ...components,
    };
}
