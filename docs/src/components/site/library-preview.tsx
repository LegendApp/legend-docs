import { Check, List, Radio, Sparkles } from 'lucide-react';

export function LibraryPreview({ slug }: { slug: string }) {
    if (slug === 'list') {
        return (
            <div className="library-preview list-preview" aria-label="Example of a dynamic list">
                <div className="preview-toolbar">
                    <List size={15} />
                    <span>Every item in its place</span>
                </div>
                <div className="list-sample">
                    <i>01</i>
                    <div>
                        <strong>A quick thought</strong>
                        <span>Lists that fit their content.</span>
                    </div>
                </div>
                <div className="list-sample">
                    <i>02</i>
                    <div>
                        <strong>A bigger idea</strong>
                        <span>
                            One line or a whole paragraph.
                            <br />
                            Every row gets the space it needs.
                        </span>
                        <div className="sample-photo" />
                    </div>
                </div>
                <div className="list-sample">
                    <i>03</i>
                    <div>
                        <strong>Keep going</strong>
                        <span>Smooth all the way down.</span>
                    </div>
                </div>
            </div>
        );
    }
    if (slug === 'state') {
        return (
            <div className="library-preview state-preview" aria-label="Example of reactive state and sync">
                <div className="preview-toolbar">
                    <Radio size={15} />
                    <span>State, connected</span>
                    <Check size={14} />
                </div>
                <pre>
                    <span className="syntax-purple">const</span> count$ ={' '}
                    <span className="syntax-blue">observable</span>(0);
                    <br />
                    <br />
                    count$.<span className="syntax-blue">set</span>(1);
                </pre>
                <div className="state-result">
                    <span>count</span>
                    <strong>1</strong>
                    <small>
                        <span /> Saved and synced
                    </small>
                </div>
            </div>
        );
    }
    return (
        <div className="library-preview motion-preview" aria-label="Example of declarative animation">
            <div className="preview-toolbar">
                <Sparkles size={15} />
                <span>A little motion</span>
            </div>
            <div className="motion-study">
                <span />
                <span />
                <span />
                <span />
            </div>
            <pre>
                &lt;<span className="syntax-blue">Motion.View</span>
                <br /> animate={'{{'} x: 100 {'}}'}
                <br /> transition={'{{'} type: 'spring' {'}}'}
                <br />
                /&gt;
            </pre>
        </div>
    );
}
