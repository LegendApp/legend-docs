export type Project = {
    slug: string;
    name: string;
    category: 'library' | 'framework' | 'app' | 'demo';
    tagline: string;
    description: string;
    status?: string;
    package?: string;
    github?: string;
    currentDocs?: string;
    highlights: string[];
};

export const projects: Project[] = [
    {
        slug: 'list',
        name: 'Legend List',
        category: 'library',
        tagline: 'Every item. Effortlessly.',
        description:
            'A fast, flexible virtualized list for React and React Native. Dynamic sizes, smooth scrolling, and a familiar API.',
        package: '@legendapp/list',
        github: 'https://github.com/LegendApp/legend-list',
        currentDocs: '/list/v3/overview/',
        highlights: ['Dynamic item sizes', 'Bidirectional scrolling', 'React + React Native'],
    },
    {
        slug: 'state',
        name: 'Legend State',
        category: 'library',
        tagline: 'Less code. Less rendering.',
        description:
            'Fine-grained reactivity with persistence and sync built in. Make your app local-first, without the boilerplate.',
        package: '@legendapp/state',
        github: 'https://github.com/LegendApp/legend-state',
        currentDocs: '/state/v3/intro/introduction/',
        highlights: ['Fine-grained reactivity', 'Local persistence', 'Powerful sync'],
    },
    {
        slug: 'motion',
        name: 'Legend Motion',
        category: 'library',
        tagline: 'A little motion. A lot of life.',
        description:
            'Declarative animations for React Native. Bring interfaces to life with a familiar API and no extra native dependencies.',
        package: '@legendapp/motion',
        github: 'https://github.com/LegendApp/legend-motion',
        currentDocs: '/motion/v2/getting-started/introduction/',
        highlights: ['Declarative animations', 'Springs + gestures', 'React Native + web'],
    },
    {
        slug: 'framework',
        name: 'Legend Frame',
        category: 'framework',
        status: 'Experimental',
        tagline: 'React, meet the desktop.',
        description:
            'An experimental framework for building native macOS apps with React, Hermes, and Expo Desktop. Windows, menus, files, and the details that make an app feel at home.',
        highlights: ['Native windows + menus', 'Hermes runtime', 'Apple silicon macOS'],
    },
    {
        slug: 'diff',
        name: 'Legend Diff',
        category: 'app',
        status: 'Preview',
        tagline: 'See what changed. Find what matters.',
        description:
            'A native macOS home for reviewing repositories, files, patches, and pull requests. Clear diffs, quick navigation, and tools for resolving conflicts.',
        highlights: ['Git + GitHub comparisons', 'Unified + block views', 'Merge conflict resolution'],
    },
    {
        slug: 'markdown',
        name: 'Legend Markdown',
        category: 'app',
        status: 'Preview',
        tagline: 'Your words. Beautifully in focus.',
        description:
            'A local-first Markdown editor for macOS. Write directly in your files, with rendered blocks that become an editor when you need them.',
        highlights: ['Plain Markdown files', 'Block editing', 'Customizable typography'],
    },
    {
        slug: 'music',
        name: 'Legend Music',
        category: 'app',
        status: 'Preview',
        tagline: 'Your library. Your listening room.',
        description:
            'A local music player built around the albums, playlists, and audio files you own. A focused listening experience, starting on macOS.',
        highlights: ['Your own audio files', 'Playlists + queue', 'Native media controls'],
    },
    {
        slug: 'slides',
        name: 'Legend Slides',
        category: 'app',
        status: 'Preview',
        tagline: 'Ideas worth putting on a bigger screen.',
        description:
            'Present local MDX decks in a native macOS app, with React components, speaker notes, and a dedicated audience window.',
        highlights: ['MDX + React', 'Presenter notes', 'Multi-display presenting'],
    },
    {
        slug: 'code',
        name: 'Legend Code',
        category: 'demo',
        status: 'Demo',
        tagline: 'A closer look at your code.',
        description:
            'A native text editor prototype for macOS, exploring incremental syntax highlighting and virtualized rendering. Edits currently stay in memory.',
        highlights: ['Text + source files', 'Native parsing', 'In-memory editing'],
    },
    {
        slug: 'chat-history',
        name: 'Legend Chat History',
        category: 'demo',
        status: 'Demo',
        tagline: 'Pick up the thread.',
        description:
            'A macOS demo for browsing local Codex and Claude transcripts in a virtualized conversation view. Its composer simulates responses locally.',
        highlights: ['Local transcripts', 'Virtualized conversations', 'Simulated composer'],
    },
    {
        slug: 'hello-world',
        name: 'Legend Hello World',
        category: 'demo',
        status: 'Demo',
        tagline: 'Start small.',
        description:
            'The minimal macOS app in the Legend Apps collection. A small baseline for exploring the shared native shell.',
        highlights: ['Minimal example', 'Shared native shell', 'macOS'],
    },
];

export const libraries = projects.filter((project) => project.category === 'library');
export const apps = projects.filter((project) => project.category === 'app');
export const demos = projects.filter((project) => project.category === 'demo');
export function getProject(slug: string) {
    return projects.find((project) => project.slug === slug);
}
