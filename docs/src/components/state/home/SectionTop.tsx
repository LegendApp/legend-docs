import { EditorStateHome } from '@/components/EditorStateHome';
import { observable, type Observable } from '@legendapp/state';
import { Memo, Show, observer, use$, useMount, useObservable } from '@legendapp/state/react';
import { $React } from '@legendapp/state/react-web';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { Button } from './Button';
import { DemoBox } from './Components';
import CurvedArrowCallout from './CurvedArrowCallout';
import { FlashingDiv } from './FlashingDiv';

const CodeDemoTop = `
const speed$ = observable(2)

const Component = () => {
  // Get and observe it
  const speed = use$(speed$)

  // Set it
  const up = () => speed$.set(v => v % 10 + 1)

  return (<>
    {/* Two way bind it */}
    <$React.input $value={speed$} type="number" />

    <Button onClick={up}>{speed} is too slow 🤘</Button>
  </>)
}
`;

const DemoTop = ({ state$ }: { state$: Observable<{ speed: number }> }) => {
    const arrowVisible$ = observable(true);
    useMount(() => {
        state$.speed.onChange(() => {
            if (state$.speed.get() > 10) {
                state$.speed.set(10);
            } else if (state$.speed.get() < 1) {
                state$.speed.set(1);
            }
            arrowVisible$.set(false);
        });
    });

    return (
        <div className="relative w-full max-w-lg">
            <EditorStateHome
                code={CodeDemoTop}
                noInline
                renderCode={`;render(<div><Box blur><Component /></Box></div>)`}
                previewWidth={190}
                showEditing={false}
                disabled
                scope={{
                    useRef,
                    useObservable,
                    Button,
                    Memo,
                    observable,
                    state$,
                    Box: DemoBox,
                    FlashingDiv,
                    $React,
                    observer,
                    use$,
                }}
                transformCode={
                    (code) =>
                        code
                            .replace(`const speed$ = observable(2)`, '')
                            .replace(
                                '<$React.input',
                                '<div className="font-bold pb-4 text-center">Particle Speed</div><$React.input className="w-20 rounded bg-zinc-700 px-2 py-2" min="1" max="10"',
                            )
                            .replace('<div>Speed', '<div className="mt-8">Speed')
                            .replace('<Button ', '<Button className="bg-blue-800 hover:bg-blue-700"')
                            .replace(/speed\$/g, 'state$.speed')
                    //   .replace(/globalState\$.name/g, "state$.name")
                    //   .replace(/speed\$\./g, "state$.speed.")
                }
                classNameEditor="home-editor w-full md:w-auto"
                classNamePreview="absolute right-0 top-0 !-mt-36 xs:!-mt-28 sm:!-mt-12 -mr-2 xs:mr-4 sm:-mr-12 shadow-lg rounded-lg"
                previewCallout={
                    <Show if={arrowVisible$} wrap={AnimatePresence}>
                        {() => (
                            <motion.div
                                className="absolute pointer-events-none w-56 right-28 sm:right-32 -top-12"
                                // style={{ right: 120, top: -50 }}
                                initial={{ opacity: 0.5 }}
                                animate={{
                                    opacity: 1,
                                    transition: {
                                        duration: 0.6,
                                        repeat: Infinity,
                                        repeatType: 'mirror',
                                        ease: 'easeInOut',
                                    },
                                }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="rotate-12">
                                    <CurvedArrowCallout />
                                </div>
                                <div className="absolute top-0 left-0 !mt-10 -ml-3 2xs:-ml-6 text-md font-bold">
                                    Turn it up!
                                </div>
                            </motion.div>
                        )}
                    </Show>
                }
            />
        </div>
    );
};

export const SectionTop = ({ state$ }: { state$: Observable<{ speed: number }> }) => {
    return (
        <div className="lg:grid grid-cols-3 mt-48 xs:mt-36 sm:mt-24 lg:mt-2 mx-auto">
            <div className="hidden lg:block pointer-events-none" />
            <div className="lg:col-span-2 relative flex justify-center">
                <DemoTop state$={state$} />
            </div>
        </div>
    );
};
