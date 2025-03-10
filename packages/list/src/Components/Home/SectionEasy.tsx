import { observable, type Observable } from '@legendapp/state';
import { Memo, Reactive, observer, useObservable } from '@legendapp/state/react';
import { useRef } from 'react';
import { Button } from 'shared/src/Components/Button';
import { Editor } from 'shared/src/Components/Editor/Editor';
import { FlashingDiv } from '../FlashingDiv/FlashingDiv';
import { DemoBox, SectionTitle } from './Components';
import { Header } from './Header';
import { Text } from './Text';

const CodeDemoTop = `
const settings$ = observable({ ui: { theme: 'dark' }})

// Infinitely nested observables
const theme$ = settings$.ui.theme

// get returns the raw data
theme$.get() // 'dark'

// set sets
theme$.set('light')

// Computed observables with just a function
const isDark$ = observable(() =>
    theme$.get() === 'dark'
)

// observe re-runs when observables change
observe(() => {
  console.log(theme$.get())
})

// use$ re-renders when observables change
const Component = () => {
  const theme = use$(settings$.ui.theme)

  return <div>{theme}</div>
})
`;

const DemoEasy = () => {
    return (
        <Editor
            code={CodeDemoTop}
            noInline
            renderCode={`;render(<div><Box><EasyComponent /></Box></div>)`}
            showEditing={false}
            scope={{
                useRef,
                useObservable,
                Button,
                Memo,
                observable,
                Box: DemoBox,
                FlashingDiv,
                Reactive,
                observer,
            }}
            classNameEditor="home-editor"
            hideDemo
            noError
        />
    );
};

export const SectionEasy = () => {
    return (
        <div className="md:flex mt-section gap-16 items-center px-4">
            <div className="flex-1">
                <Header size="h2" className="!mt-0">
                    🦄 Incredibly easy to use
                </Header>
                <Text className="pt-2 max-w-2xl mx-auto">
                    When you get() values while observing, it tracks them and re-runs when they change. No boilerplate,
                    no selectors, no dependency arrays, just easy reactivity.
                </Text>
            </div>
            <div className="mx-auto max-w-lg flex-2 !mt-8 !md:mt-0 [&>div]:!mt-0 md:min-w-[480px]">
                <DemoEasy />
            </div>
        </div>
    );
};

/*
        <div className="inline-flex items-center gap-2 border border-tBorder rounded-full px-4 py-1 text-blue-600 text-xs font-semibold">
          <div className="bg-blue-600 rounded-full w-3 h-1.5 text-white text-xs font-semibold" />
          Easy
        </div>
        */
