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
    homepage?: {
        download?: string;
        image?: string;
        details: { label: string; text: string }[];
    };
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
        slug: 'spark',
        name: 'Legend Spark',
        category: 'framework',
        status: 'Experimental — not for production',
        github: 'https://github.com/LegendApp/legend-spark',
        tagline: 'React Native, meet the desktop.',
        description:
            'An experimental React Native and Expo Desktop framework with native desktop APIs and prebuilt development runtimes. Not ready for production use.',
        highlights: ['Native windows + menus', 'Hermes runtime', 'Spark Runner + Fast Refresh'],
    },
    {
        slug: 'diff',
        name: 'Legend Diff',
        category: 'app',
        status: 'Preview',
        tagline: 'See what changed. Find what matters.',
        description:
            'A native macOS diff viewer for Git working trees, files, patches, and GitHub pull requests, with merge conflict resolution built in.',
        highlights: ['Git + GitHub comparisons', 'Unified + block views', 'Merge conflict resolution'],
        homepage: {
            download: 'https://github.com/LegendApp/legend-apps/releases/tag/diff-v0.0.4',
            image: '/assets/apps/diff-window.jpg',
            details: [
                { label: 'Opens', text: 'A Git working tree against any branch, tag, or commit. Two files (⌘⌥O). .diff and .patch files. GitHub pull request and commit URLs (⌘L), or a supported path or URL from the clipboard (⌘⇧O).' },
                { label: 'Reading', text: 'Changed files in a sidebar. Unified (⌘1) or side-by-side (⌘2) views. Jump between hunks with ⌘[ and ⌘], or search the whole diff with ⌘F.' },
                { label: 'Conflicts', text: 'Pick ours, theirs, or both for each conflict. Drafts are kept until you save the resolved file.' },
                { label: 'Terminal', text: 'Install the ldiff command from Settings to open git diff arguments in the app.' },
                { label: 'Requires', text: 'macOS 14 or later. Local repository comparisons need Git.' },
            ],
        },
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
        homepage: {
            image: '/assets/apps/markdown-window.jpg',
            details: [
                { label: 'Files', text: 'Opens .md, .markdown, .mdown, .mkd, and .mdx. Save, Save As, and optional autosave write straight back to the file.' },
                { label: 'Editing', text: 'Blocks render until you click into one, then edit in place as Markdown. Undo, redo, and keyboard navigation between blocks.' },
                { label: 'Formatting', text: 'Headings, bold, italic, strikethrough, links (⌘K), lists, quotes, and code from the Format menu or a toolbar above the selection, at the top, at the bottom, or hidden.' },
                { label: 'Typography', text: 'Font, size, line height, content width, and density. Load your own theme files and rebind editor hotkeys.' },
                { label: 'Safety', text: 'Asks before discarding unsaved changes, and reloads a clean file when it changes on disk.' },
            ],
        },
    },
    {
        slug: 'music',
        name: 'Legend Music',
        category: 'app',
        status: 'Preview',
        tagline: 'Your library. Your listening room.',
        description:
            'A local music player for macOS, built around the folders, audio files, and .m3u playlists you already have.',
        highlights: ['Your own audio files', 'Playlists + queue', 'Native media controls'],
        homepage: {
            details: [
                { label: 'Library', text: 'Scans one or more folders and caches track metadata and artwork. Browse and search by album, artist, or playlist.' },
                { label: 'Formats', text: 'MP3, WAV, M4A, AAC, FLAC, AIFF, and CAF.' },
                { label: 'Playback', text: 'A queue with shuffle, repeat, volume, and seeking. The queue and playback state are restored on the next launch.' },
                { label: 'Playlists', text: 'Create, rename, edit, import, and export plain .m3u files.' },
                { label: 'Controls', text: 'Media keys, global hotkeys, and an optional current-song overlay. Themes, translucent backgrounds, and a choice of which playback controls to show.' },
            ],
        },
    },
    {
        slug: 'photos',
        name: 'Legend Photos',
        category: 'app',
        status: 'Preview',
        tagline: 'Your photos. A clearer view.',
        description:
            'A macOS photo browser for local folders and your Apple Photos library. Browse a photo grid, open fullscreen views, and mark your selections with ratings and flags.',
        highlights: ['Local folders + Apple Photos albums', 'Fullscreen viewing + filmstrip', 'Ratings + flags'],
        homepage: {
            download: 'https://github.com/LegendApp/legend-photos/releases',
            details: [
                { label: 'Sources', text: 'Local folders and your Apple Photos albums.' },
                { label: 'Browsing', text: 'A photo grid you navigate with the arrow keys; - and = change the column count. Return opens a photo fullscreen, and F shows the filmstrip.' },
                { label: 'Culling', text: 'Rate with 1–5, flag with Space or P, reject with X. Your choices are kept in local metadata.' },
                { label: 'Hotkeys', text: 'Every shortcut can be rebound in Settings. Press / to see them all.' },
            ],
        },
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
            'A full native code editor for any text file on macOS, with syntax highlighting, line editing commands, and Save and Save As.',
        highlights: ['Any text file', 'Syntax highlighting', 'Save + editing commands'],
        homepage: {
            download: 'https://github.com/LegendApp/legend-apps/releases/tag/code-v0.0.1',
            image: '/assets/apps/code-window.jpg',
            details: [
                { label: 'Files', text: 'Any UTF-8 text file: source, config, dotfiles, files with no extension. Open from Finder, ⌘O, or recent documents. Save with ⌘S or ⌘⇧S.' },
                { label: 'Editing', text: 'Go to line (⌘L), indent and outdent (⌘] ⌘[), toggle line comments (⌘/), duplicate lines (⌘⇧D), move lines (⌥↑ ⌥↓). Brackets and quotes pair automatically.' },
                { label: 'Highlighting', text: 'Only visible lines are rendered while the rest of the file is highlighted in the background. Unrecognized formats open as plain text.' },
                { label: 'Settings', text: 'Font, font size, and syntax theme, or turn highlighting off.' },
            ],
        },
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
        homepage: {
            download: 'https://github.com/LegendApp/legend-apps/releases/tag/chat-history-v0.0.2',
            image: '/assets/apps/chat-history-window.jpg',
            details: [
                { label: 'Sources', text: 'Finds recent Codex and Claude sessions on your Mac and groups them by provider in the sidebar.' },
                { label: 'Transcript', text: 'A virtualized view for long threads, with Markdown, highlighted code blocks, and local images sized before they load.' },
                { label: 'Relaunch', text: 'Reopens to the last chat, with the window frame and sidebar restored.' },
                { label: 'Composer', text: 'A demo only. It streams a simulated reply in memory, sends nothing to a model, and saves nothing.' },
            ],
        },
    },
];

export const libraries = projects.filter((project) => project.category === 'library');
export const apps = projects.filter((project) => project.category === 'app');
export const demos = projects.filter((project) => project.category === 'demo');
export const appHomepages = projects.filter((project) => project.homepage);
export function getProject(slug: string) {
    return projects.find((project) => project.slug === slug);
}
