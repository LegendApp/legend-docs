import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { Highlight, themes } from "prism-react-renderer";

themes.vsDark.plain.backgroundColor = '#222224';

const noTheme: EditorProps["theme"] = {
  plain: {},
  styles: [],
};

export const Editor = ({
  code,
  scope,
}: {
  code: string;
  scope?: Record<string, unknown>;
}) => {
  return (
    <LiveProvider
      code={code}
      scope={scope}
      noInline={true}
      enableTypeScript
      theme={themes.vsDark}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-3">
          <LiveEditor />
        </div>
        <div className="col-span-1 rounded">
          <LivePreview />
        </div>
      </div>
      <LiveError />
    </LiveProvider>
  );
};
