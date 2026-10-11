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
        features: { title: string; text: string }[];
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
            'A native macOS home for reviewing repositories, files, patches, and pull requests. Clear diffs, quick navigation, and tools for resolving conflicts.',
        highlights: ['Git + GitHub comparisons', 'Unified + block views', 'Merge conflict resolution'],
        homepage: {
            download: 'https://github.com/LegendApp/legend-apps/releases/tag/diff-v0.0.4',
            image: '/assets/showcase/diff.png',
            features: [
                { title: 'Every change, in one place.', text: 'Review a Git working tree, compare branches and refs, or open two files side by side. Load patches, GitHub pull requests, and commits directly into the viewer.' },
                { title: 'Find your way through the diff.', text: 'Browse changed files in the sidebar, switch between unified and block views, and search across the whole diff. Syntax highlighting and full-file context help you see the bigger picture.' },
                { title: 'Resolve conflicts with confidence.', text: 'Choose ours, theirs, or both for each merge conflict. Keep drafts as you work, then save the resolved files. Open comparisons from your terminal with the ldiff command.' },
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
            image: '/assets/showcase/markdown.png',
            features: [
                { title: 'Your writing. Your files.', text: 'Create a document or open your existing Markdown files. Save, Save As, and optional autosave keep your words in ordinary files, ready to use wherever you need them.' },
                { title: 'Write in the document.', text: 'Read rendered blocks and edit them directly. Format headings, links, lists, quotes, and code with native menus and a toolbar you can arrange around your workflow.' },
                { title: 'Make space for your words.', text: 'Choose your fonts, line height, content width, and document density. Customize themes, toolbar contents, and editor hotkeys to make the writing space your own.' },
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
            'A local music player built around the albums, playlists, and audio files you own. A focused listening experience, starting on macOS.',
        highlights: ['Your own audio files', 'Playlists + queue', 'Native media controls'],
        homepage: {
            features: [
                { title: 'A home for the music you own.', text: 'Add your library folders and browse by album, artist, or track. Local artwork and metadata bring your collection together, with support for MP3, WAV, M4A, AAC, FLAC, AIFF, and CAF files.' },
                { title: 'Set the mood. Keep it playing.', text: 'Build a queue, shuffle, repeat, and pick up your playback state across launches. Create and edit local M3U playlists, or import and export the ones you already have.' },
                { title: 'Keep your music close.', text: 'Control playback with native media keys and configurable hotkeys. Choose a current-song overlay, adjust the visible playback controls, and personalize themes and translucent backgrounds.' },
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
            features: [
                { title: 'Bring your collection into view.', text: 'Browse photos from local folders and your Apple Photos albums in a photo grid. Keep the files and library you already use at the center of your workflow.' },
                { title: 'Give each photo the whole screen.', text: 'Open a photo fullscreen for a closer look. Use the filmstrip to move through your collection without losing your place.' },
                { title: 'Keep track of your favorites.', text: 'Use ratings and flags to mark your selections as you browse. Your choices stay in local metadata, ready for your next pass through the collection.' },
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
            'A full native code editor for any text file on macOS. Edit source, configuration, and plain text with syntax highlighting, familiar editing commands, and native file handling.',
        highlights: ['Any text file', 'Syntax highlighting', 'Save + editing commands'],
        homepage: {
            download: 'https://github.com/LegendApp/legend-apps/releases/tag/code-v0.0.1',
            image: '/assets/showcase/code.png',
            features: [
                { title: 'Any text file. Ready to edit.', text: 'Open source code, configuration, dotfiles, and extensionless text files from Finder, the Open dialog, or recent documents. Edit and save your work with native Save and Save As commands.' },
                { title: 'Keep your hands on the keyboard.', text: 'Find text, jump to a line, indent, toggle comments, and duplicate or move lines. Automatic bracket and quote pairs help you keep writing.' },
                { title: 'See your code clearly.', text: 'Incremental syntax highlighting and virtualized lines keep the editor focused on what is in view. Choose your font, font size, and syntax theme; unrecognized formats open as plain text.' },
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
            image: '/assets/showcase/chat-history.png',
            features: [
                { title: 'Your conversations, together.', text: 'Browse local Codex and Claude transcripts in one Mac app. A sidebar groups conversations by provider and puts recent chats within reach.' },
                { title: 'Read the whole thread.', text: 'Move through long conversations in a virtualized transcript view. Messages, code, and images stay together so you can revisit the context behind your work.' },
                { title: 'Return to where you left off.', text: 'The app remembers your selected conversation and window position across launches. Its demo composer simulates responses locally, without sending a message to a model.' },
            ],
        },
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
        homepage: {
            features: [
                { title: 'One small hello.', text: 'A white window. Centered text. Hello, world! The smallest app in the collection gives you a clear starting point.' },
                { title: 'Start with the shared shell.', text: 'Hello World uses the same native macOS host as the other Legend Apps, with manifest-based app selection and the shared styling and runtime infrastructure.' },
                { title: 'A baseline you can build on.', text: 'The release manifest selects no app-specific native modules. Use this minimal example to explore the shell before adding the features your own app needs.' },
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
