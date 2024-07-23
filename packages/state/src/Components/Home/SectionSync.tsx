import { observable } from "@legendapp/state";
import { Memo } from "@legendapp/state/react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { SectionTitle } from "./Components";

const CodeDemoSync = `
const messages$ = observable([])
`;

const DemoSync = () => {
  return (
    <Editor
      code={CodeDemoSync}
      noInline
      renderCode={`;render(null)`}
      disableDemo
      showEditing={false}
      scope={{
        Memo,
        observable,
      }}
      classNameEditor="home-editor"
    />
  );
};

export const SectionSync = () => {
  return (
    <div className="!mt-20 max-w-3xl mx-auto">
      <SectionTitle
        text="💾 Powerful sync and persistence"
        description="Legend-State includes a powerful sync and persistence system that enables local-first apps with optimistic updates, retry mechanisms, and efficient diff-based syncing. It supports various storage and sync backends, making it easy to build robust, offline-capable applications."
      />
      <DemoSync />
    </div>
  );
};
