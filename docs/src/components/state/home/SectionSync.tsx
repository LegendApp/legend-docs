import { observable } from '@legendapp/state';
import { Memo, observer, use$, useObservable } from '@legendapp/state/react';
import { useRef } from 'react';
import { Button } from './Button';
import { Editor } from './Editor';
import { FlashingDiv } from './FlashingDiv';
import { DemoBox } from './Components';
import { Header } from './Header';
import { Text } from './Text';

const CodeDemoTop = `
const profile$ = observable(syncedFetch({
  get: 'https://myurl/my-profile',
  set: 'https://myurl/my-profile',
  persist: {
    plugin: ObservablePersistLocalStorage,
    name: 'profile',
  },
}))

const Component = () => {
  // get triggers fetch and updates on change
  const name = use$(profile$.name)

  const onClick = () => {
    // set sets the local state and syncs
    profile$.name.set('Annyong')
  }

  // Two-way bind to remote data
  return <$React.input $value={profile$.name} />
}
`;

const DemoSync = () => {
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
                observer,
                use$,
            }}
            classNameEditor="home-editor"
            hideDemo
            noError
        />
    );
};

export const SectionSync = () => {
    return (
        <div className="lg:flex items-center mt-section gap-16 px-4">
            <div className="flex-1">
                <Header size="h2" className="md:text-nowrap">
                    🤝 Local State = Remote State
                </Header>
                <Text className="pt-2">
                    Just get and set observables and they <span className="text-white">sync themselves</span> with a
                    powerful sync engine. Your UI code doesn&apos;t need any querying, creating mutations, or synchronizing
                    with local state.
                </Text>
                <Text className="pt-2">You can even bind UI components directly to synced observables.</Text>
                <Text className="pt-2">
                    You don&apos;t need any sync code in your components. You can just focus on making great apps.
                </Text>
            </div>
            <div className="max-w-lg flex-2 !md:mt-0 [&>div]:!mt-0 sm:min-w-[460px] mx-auto">
                <DemoSync />
            </div>
        </div>
    );
};