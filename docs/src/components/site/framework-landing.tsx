import Link from 'next/link';
import { ArrowRight, Braces, Files, Keyboard, PanelsTopLeft, PanelTop } from 'lucide-react';

const features = [
    {
        Icon: PanelsTopLeft,
        title: 'Real windows.',
        text: 'Build a desktop workspace with native app and window lifecycle.',
    },
    {
        Icon: PanelTop,
        title: 'Real menus.',
        text: 'Put actions where Mac users expect them, with native menus and shortcuts.',
    },
    {
        Icon: Files,
        title: 'Your own files.',
        text: 'Work with local files, documents, settings, and the clipboard.',
    },
    {
        Icon: Keyboard,
        title: 'The little details.',
        text: 'Bring desktop behavior into your React app without starting from scratch.',
    },
];

export function FrameworkLanding() {
    return (
        <main id="main" className="framework-landing container">
            <header className="collection-header">
                <div>
                    <div className="eyebrow">
                        <Link href="/">LEGEND</Link>
                        <span>/</span> FRAMEWORK <span className="status-badge">Experimental</span>
                    </div>
                    <h1>
                        React, meet
                        <br />
                        <span>the desktop.</span>
                    </h1>
                    <p>
                        Your React skills. A native macOS app.
                        <br />
                        Windows, menus, and files that feel right at home.
                    </p>
                    <Link href="/framework/getting-started" className="button button-primary">
                        Explore the docs <ArrowRight size={15} />
                    </Link>
                </div>
                <div className="framework-terminal">
                    <div className="showcase-top">
                        <div className="window-dots">
                            <i />
                            <i />
                            <i />
                        </div>
                        <span>A NEW KIND OF DESKTOP FOUNDATION</span>
                    </div>
                    <div className="runtime-stack">
                        <Braces size={31} strokeWidth={1.2} />
                        <h2>Your React app</h2>
                        <p>React Native + Hermes</p>
                        <div className="runtime-rule" />
                        <span>LEGEND FRAMEWORK</span>
                        <div className="runtime-platforms">
                            <span>Windows</span>
                            <span>Menus</span>
                            <span>Files</span>
                        </div>
                        <small>Built on Expo Desktop</small>
                    </div>
                </div>
            </header>
            <div className="framework-status">
                <span className="blue-dot" />
                <p>
                    An early experiment, starting with Apple silicon macOS. Public packages and app binaries have not
                    been published yet.
                </p>
            </div>
            <section className="framework-features" aria-label="Native desktop capabilities">
                {features.map(({ Icon, title, text }) => (
                    <div key={title}>
                        <Icon size={23} strokeWidth={1.4} />
                        <h2>{title}</h2>
                        <p>{text}</p>
                    </div>
                ))}
            </section>
            <section className="collection-crosslink">
                <div>
                    <span className="eyebrow">A FIRST LOOK</span>
                    <h2>Room for the whole desktop.</h2>
                    <p>
                        The documentation shell is ready. Setup guides and the API reference are coming before launch.
                    </p>
                </div>
                <div className="framework-doc-links">
                    <Link href="/framework/getting-started">
                        Getting started <ArrowRight size={15} />
                    </Link>
                    <Link href="/framework/reference">
                        API reference <ArrowRight size={15} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
