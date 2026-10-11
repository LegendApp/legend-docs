import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const heroCode = `import { openWindow } from '@legendapp/spark/windows'
import { createMenu } from '@legendapp/spark/menus'

// A real native window, rendered by React Native
await openWindow({
  id: 'inspector',
  component: 'Inspector',
  title: 'Inspector',
  size: { width: 480, height: 640 },
})

// A real menu bar, with real shortcuts
await createMenu({
  id: 'editor',
  items: [{
    type: 'submenu', id: 'file', label: 'File',
    items: [{ type: 'action', id: 'open',
              label: 'Open…', shortcut: 'CmdOrCtrl+O' }],
  }],
  onAction: ({ itemId }) => runCommand(itemId),
})`;

const badges = [
    { title: '🪟  Windows', subtitle: 'Native, multi-window' },
    { title: '📋  Menus', subtitle: 'Menu bar + shortcuts' },
    { title: '📁  Files', subtitle: 'Dialogs, IO, watching' },
    { title: '⚡️  Fast Refresh', subtitle: 'In Spark Runner' },
    { title: '📦  Ships', subtitle: 'Standalone .app' },
];

const steps = [
    {
        title: 'Start in Spark Runner',
        text: 'A prebuilt development app. Create a project and edit App.tsx with Fast Refresh, no Xcode required.',
        code: 'npx @legendapp/spark@next create MyApp\ncd MyApp\nnpm run macos',
    },
    {
        title: 'Add native when you need it',
        text: 'Adding native modules or helper executables switches you to an app-specific development build. JavaScript changes never need a rebuild.',
        code: '# custom development build\nnpm run macos',
    },
    {
        title: 'Ship a real Mac app',
        text: 'Build a standalone .app with embedded JavaScript, then sign and notarize it with your own credentials.',
        code: 'npm run build\nnpx --no-install spark open',
    },
];

function CodeWindow({ code, title }: { code: string; title?: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-zinc-900/90 shadow-2xl overflow-hidden text-left">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                {title && <span className="ml-3 text-xs text-white/40 font-mono">{title}</span>}
            </div>
            <pre className="!m-0 !bg-transparent p-5 text-[13px] leading-relaxed overflow-x-auto text-white/85">
                <code>{code}</code>
            </pre>
        </div>
    );
}

export function FrameworkLanding() {
    return (
        <main data-doc-content id="main" className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 -top-40 h-[640px] bg-gradient-to-br from-blue-600/25 via-indigo-600/10 to-amber-400/10 blur-3xl" />

            {/* Hero */}
            <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:items-center">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/assets/legend-spark.png" alt="" width={44} height={44} className="rounded-xl" />
                        <span className="text-xs font-semibold tracking-wide uppercase rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 px-3 py-1">
                            Experimental preview
                        </span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                        React, meet the desktop.
                    </h1>
                    <p className="mt-6 text-lg text-white/70 max-w-xl">
                        Legend Spark turns a React Native app into a real macOS app, with native windows, menus, and
                        files. Develop with Fast Refresh, then ship a standalone <code>.app</code>.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/spark/getting-started"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/25 no-underline"
                        >
                            Get started <ArrowRight size={16} />
                        </Link>
                        <a
                            href="https://github.com/LegendApp/legend-spark"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/15 hover:border-white/30 px-5 py-3 font-semibold text-white/90 no-underline"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
                <div className="mt-12 lg:mt-0">
                    <CodeWindow code={heroCode} title="App.tsx" />
                </div>
            </section>

            {/* Badges */}
            <section className="relative max-w-5xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-white">Everything a desktop app needs</h2>
                <p className="mt-3 text-white/60 max-w-xl mx-auto">
                    One package, <code>@legendapp/spark</code>, with typed APIs for the parts of the desktop React Native
                    doesn&apos;t cover.
                </p>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-tBorder bg-tBg rounded-lg">
                    {badges.map(({ title, subtitle }) => (
                        <div key={title} className="px-4 py-4">
                            <div className="text-white font-bold whitespace-pre">{title}</div>
                            <div className="text-sm text-white/60 pt-1">{subtitle}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Workflow */}
            <section className="relative max-w-6xl mx-auto px-6 pt-28">
                <h2 className="text-3xl font-bold text-white text-center">From first line to shipped app</h2>
                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    {steps.map(({ title, text, code }, i) => (
                        <div key={title} className="flex flex-col">
                            <div className="text-sm font-mono text-blue-400">0{i + 1}</div>
                            <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
                            <p className="mt-2 mb-4 text-white/60 flex-1">{text}</p>
                            <CodeWindow code={code} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Status + docs */}
            <section className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 grid gap-10 lg:grid-cols-2">
                <div>
                    <h2 className="text-3xl font-bold text-white">Honest about where it is</h2>
                    <p className="mt-4 text-white/60">
                        Spark is experimental and not ready for production. macOS on Apple Silicon is the primary target;
                        Intel and Windows builds are in progress. The docs track the current source, which is newer than
                        the published preview.
                    </p>
                    <Link href="/spark/limitations" className="mt-4 inline-flex items-center gap-2 text-blue-400 no-underline">
                        Status and limitations <ArrowRight size={15} />
                    </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    {[
                        ['Overview', '/spark/overview', 'How the pieces fit'],
                        ['Getting started', '/spark/getting-started', 'Create your first app'],
                        ['API guide', '/spark/reference', 'Every capability'],
                        ['Examples', '/spark/examples', 'Learn from real apps'],
                    ].map(([label, href, sub]) => (
                        <Link
                            key={href}
                            href={href}
                            className="rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/25 p-4 no-underline"
                        >
                            <div className="font-semibold text-white">{label}</div>
                            <div className="text-sm text-white/50">{sub}</div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
