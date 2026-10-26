import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const heroCode = `import { AppRegistry, Text } from 'react-native'
import { createMenu } from '@legendapp/spark/menus'
import { openWindow } from '@legendapp/spark/windows'

AppRegistry.registerComponent('Inspector', () => () => <Text>Inspector</Text>)

createMenu({
  id: 'editor',
  items: [{
    type: 'submenu', id: 'view', label: 'View',
    items: [{ type: 'action', id: 'inspector',
              label: 'Show Inspector', shortcut: 'CmdOrCtrl+I' }],
  }],
  onAction: ({ itemId }) => {
    if (itemId === 'inspector') {
      // A second native window, rendering a React Native root
      openWindow({
        id: 'inspector',
        component: 'Inspector',
        title: 'Inspector',
        size: { width: 480, height: 640 },
      })
    }
  },
}).catch(console.error)`;

const capabilities = [
    { path: '/windows', title: 'Windows', text: 'Named windows, displays, geometry, close guards, and native macOS chrome.' },
    { path: '/menus', title: 'Menus', text: 'The app menu bar, context menus, tray items, and Dock menus.' },
    { path: '/shortcuts', title: 'Shortcuts', text: 'Local and global accelerators, with command routing.' },
    { path: '/files', title: 'Files and dialogs', text: 'Open and save panels, atomic writes, streams, watching, and Trash.' },
    { path: '/settings', title: 'Settings', text: 'JSON settings, Legend State persistence, and secure storage.' },
    { path: '/updates', title: 'Updates', text: 'Native whole-app updates for the apps you ship.' },
];

const runtimes = [
    {
        label: 'Spark Runner',
        title: 'Start without Xcode',
        text: 'A prebuilt development app. Create a project, run it, and edit App.tsx with Fast Refresh.',
        code: 'npm create @legendapp/spark MyApp\ncd MyApp\nnpm run macos',
    },
    {
        label: 'Custom development build',
        title: 'Add native when you need it',
        text: 'Extra native modules or helper executables need an app-specific build. JavaScript changes still use Fast Refresh.',
        code: 'npx --no-install spark build --dev --platform macos',
    },
    {
        label: 'Standalone app',
        title: 'Ship a real Mac app',
        text: 'Build a .app with embedded JavaScript, then sign and notarize it with your own Developer ID.',
        code: 'npm run build\nnpm run package',
    },
];

const docs = [
    { label: 'Overview', href: '/spark/overview', text: 'How the pieces fit' },
    { label: 'Getting started', href: '/spark/getting-started', text: 'Create and run an app' },
    { label: 'Development', href: '/spark/development', text: 'Runtimes and native changes' },
    { label: 'API guide', href: '/spark/reference', text: 'Every capability' },
    { label: 'Examples', href: '/spark/examples', text: 'Kitchen Sink and small apps' },
];

export function highlight(code: string) {
    return code.split(/('[^']*'|\/\/.*|\b(?:import|from|await|if)\b)/g).map((part, i) =>
        part.startsWith("'") ? (
            <span key={i} className="text-[#9fd3a8]">{part}</span>
        ) : part.startsWith('//') ? (
            <span key={i} className="text-white/35">{part}</span>
        ) : /^(import|from|await|if)$/.test(part) ? (
            <span key={i} className="text-[#b3a1cb]">{part}</span>
        ) : (
            part
        ),
    );
}

function Terminal({ code }: { code: string }) {
    return (
        <pre className="!m-0 rounded-lg border border-[#29313a] bg-[#11171e] px-4 py-3.5 text-[12.5px] leading-relaxed text-[#a4b4c5] overflow-x-auto">
            <code>
                {code.split('\n').map((line) => (
                    <div key={line}>
                        <span className="select-none text-white/25">$ </span>
                        {line}
                    </div>
                ))}
            </code>
        </pre>
    );
}

export function FrameworkLanding() {
    return (
        <main data-doc-content id="main" className="pb-24">
            {/* Hero */}
            <section className="container pt-20 sm:pt-24 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:items-center">
                <div>
                    <div className="flex items-center gap-3 mb-7">
                        <img src="/assets/legend-spark.png" alt="" width={40} height={40} className="rounded-[10px]" />
                        <span className="text-white/90 font-medium">Legend Spark</span>
                        <span className="status-badge">Experimental — not for production</span>
                    </div>
                    <h1 className="text-[44px] sm:text-[58px] font-medium tracking-[-0.045em] leading-[1.05] text-white">
                        React Native on desktop.
                    </h1>
                    <p className="mt-6 text-[17px] leading-relaxed text-[#a4adb6] max-w-[480px]">
                        Spark gives React Native apps real windows, menus, dialogs, and files on the Mac. Start in a
                        prebuilt runner with Fast Refresh, then ship a standalone <code className="text-white/85">.app</code>.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center gap-3">
                        <Link href="/spark/getting-started" className="button button-primary">
                            Get started <ArrowRight size={15} />
                        </Link>
                        <a href="https://github.com/LegendApp/legend-spark" className="button button-outline text-[#d1d6df]">
                            GitHub <ArrowUpRight size={15} />
                        </a>
                    </div>
                </div>
                <figure className="mt-14 lg:mt-0 min-w-0">
                    <div className="rounded-xl border border-[#29313a] bg-[#11171e] shadow-[0_24px_60px_#0008] overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#232b33]">
                            <span className="size-2.5 rounded-full bg-white/15" />
                            <span className="size-2.5 rounded-full bg-white/15" />
                            <span className="size-2.5 rounded-full bg-white/15" />
                            <span className="ml-3 text-[11px] text-white/40 font-mono">App.tsx</span>
                        </div>
                        <pre className="!m-0 !bg-transparent px-5 py-4 text-[12.5px] leading-[1.7] text-[#c9d3dd] overflow-x-auto">
                            <code>{highlight(heroCode)}</code>
                        </pre>
                    </div>
                    <figcaption className="mt-3 text-xs text-[#787c85]">
                        Spark 0.0.1 API ·{' '}
                        <Link href="/spark/getting-started" className="text-[#91c7e9] hover:text-white">
                            see Getting started
                        </Link>
                    </figcaption>
                </figure>
            </section>

            {/* Capabilities */}
            <section className="container pt-28 sm:pt-32">
                <div className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-14">
                    <div className="mb-8 lg:mb-0">
                        <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">One package, the whole desktop.</h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-[#929da8] max-w-sm">
                            Import each capability from <code className="text-white/80">@legendapp/spark</code>. Typed and
                            async, with explicit ownership and cleanup.
                        </p>
                        <Link
                            href="/spark/reference"
                            className="mt-5 inline-flex items-center gap-2 text-[13px] text-[#91c7e9] hover:text-white"
                        >
                            All capabilities <ArrowRight size={14} />
                        </Link>
                    </div>
                    <dl className="grid sm:grid-cols-2 border-t border-[#29313a]">
                        {capabilities.map(({ path, title, text }) => (
                            <div key={path} className="py-5 border-b border-[#29313a] sm:odd:pr-8 sm:even:pl-8 sm:even:border-l">
                                <dt className="flex items-baseline justify-between gap-4">
                                    <span className="text-white font-medium">{title}</span>
                                    <code className="text-[11px] text-[#6d8498]">{path}</code>
                                </dt>
                                <dd className="mt-1.5 text-[13.5px] leading-relaxed text-[#929da8]">{text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* Runtimes */}
            <section className="container pt-28 sm:pt-32">
                <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">One project, three ways to run it.</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#929da8] max-w-xl">
                    Move from a shared runner to your own build only when the project needs it. Spark checks native
                    requirements before loading JavaScript.
                </p>
                <ol className="mt-10 grid gap-x-8 gap-y-12 lg:grid-cols-3">
                    {runtimes.map(({ label, title, text, code }, i) => (
                        <li key={label} className="flex flex-col border-t border-[#29313a] pt-5">
                            <span className="font-mono text-[11px] tracking-wide text-[#6d8498]">
                                0{i + 1} / {label.toUpperCase()}
                            </span>
                            <h3 className="mt-3 text-lg font-medium text-white">{title}</h3>
                            <p className="mt-2 mb-5 flex-1 text-[13.5px] leading-relaxed text-[#929da8]">{text}</p>
                            <Terminal code={code} />
                        </li>
                    ))}
                </ol>
            </section>

            {/* Architecture */}
            <section className="container pt-28 sm:pt-32">
                <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-14 border-y border-[#29313a] py-12">
                    <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">No browser inside.</h2>
                    <div className="grid gap-8 sm:grid-cols-2 text-[14px] leading-relaxed text-[#929da8]">
                        <p>
                            <span className="block text-white font-medium mb-1.5">React Native all the way down</span>
                            Screens are React Native views and your JavaScript runs in Hermes. Node runs the tooling and
                            is never bundled into the app.
                        </p>
                        <p>
                            <span className="block text-white font-medium mb-1.5">The Expo workflow you know</span>
                            Expo Desktop generates the native host and Expo CLI owns Metro, logs, and reload. Spark adds
                            desktop APIs and runtime selection.
                        </p>
                    </div>
                </div>
            </section>

            {/* Status + docs */}
            <section className="container pt-28 sm:pt-32 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
                <div>
                    <h2 className="text-[26px] font-medium tracking-[-0.02em] text-white">Where it stands</h2>
                    <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#929da8] max-w-lg">
                        <p>
                            macOS 14+ on Apple Silicon is the primary target. Intel Mac builds and Windows development
                            still need native validation.
                        </p>
                        <p>
                            Spark 0.0.1 downloads a matching macOS Apple Silicon Runner on first launch.
                            Test signed distribution with your own app and credentials.
                        </p>
                    </div>
                    <Link
                        href="/spark/limitations"
                        className="mt-5 inline-flex items-center gap-2 text-[13px] text-[#91c7e9] hover:text-white"
                    >
                        Status and limitations <ArrowRight size={14} />
                    </Link>
                </div>
                <nav aria-label="Spark documentation" className="grid content-start border-t border-[#29313a]">
                    {docs.map(({ label, href, text }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex items-center gap-4 border-b border-[#29313a] py-4 text-[#929da8] hover:text-white"
                        >
                            <span className="text-white font-medium w-36 shrink-0">{label}</span>
                            <span className="text-[13.5px] flex-1">{text}</span>
                            <ArrowRight size={15} className="text-[#697b88] group-hover:text-white transition-colors" />
                        </Link>
                    ))}
                </nav>
            </section>
        </main>
    );
}
