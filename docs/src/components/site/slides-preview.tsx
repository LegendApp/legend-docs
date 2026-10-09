'use client';

import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const cards = [
    { title: 'Write.', detail: 'Start with a plain text file.', className: 'write' },
    { title: 'Compose.', detail: 'Give every idea its space.', className: 'compose' },
    { title: 'Present.', detail: 'Bring the room with you.', className: 'present' },
];
const notes = [
    'Start with the idea. Let it breathe.',
    'The same title moves into a new layout.',
    'A Markdown file is all you need to begin.',
    'Reveal one thought at a time.',
    'Your notes stay with you. Your idea fills the screen.',
];

export function SlidesPreview() {
    const [position, setPosition] = useState(0);
    function next() {
        setPosition((value) => Math.min(notes.length - 1, value + 1));
    }
    function previous() {
        setPosition((value) => Math.max(0, value - 1));
    }
    return (
        <div className="slides-demo">
            <div className="slides-demo-top">
                <span className="slides-demo-dot" /> product-update.mdx <span>TRY A REVEAL</span>
            </div>
            <div
                className="slides-demo-stage"
                data-position={position}
                tabIndex={0}
                role="group"
                aria-label="Interactive illustration of a two-slide deck. Use left and right arrow keys to navigate."
                onKeyDown={(event) => {
                    if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        next();
                    }
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        previous();
                    }
                }}
            >
                <div className="slides-demo-orbit" aria-hidden="true">
                    <i /><i /><i /><span />
                </div>
                <div className="slides-demo-content">
                    <span className="slides-demo-kicker">A CLEAR IDEA / {position === 0 ? '01' : '02'}</span>
                    <p className="slides-demo-title">
                        Make room<br />for your idea.
                    </p>
                    <div className="slides-demo-cards">
                        {cards.map((card, index) => (
                            <div
                                key={card.title}
                                className={`slides-demo-card ${card.className}`}
                                data-visible={position >= index + 2}
                                aria-hidden={position < index + 2}
                            >
                                <span>0{index + 1}</span>
                                <strong>{card.title}</strong>
                                <p>{card.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="slides-demo-controls">
                <span role="status" aria-live="polite">
                    Slide {position === 0 ? '1 / 2' : `2 / 2 · Step ${position} / 4`}
                </span>
                <div>
                    <button type="button" aria-label="Previous preview state" disabled={position === 0} onClick={previous}>
                        <ArrowLeft size={17} />
                    </button>
                    {position === notes.length - 1 ? (
                        <button type="button" aria-label="Restart preview" onClick={() => setPosition(0)}>
                            <RotateCcw size={17} />
                        </button>
                    ) : (
                        <button type="button" aria-label="Next preview state" onClick={next}>
                            <ArrowRight size={17} />
                        </button>
                    )}
                </div>
            </div>
            <div className="slides-demo-notes">
                <span>YOUR NOTES</span><p>{notes[position]}</p>
            </div>
            <p className="slides-demo-caption">Interactive illustration. See the native app below.</p>
        </div>
    );
}
