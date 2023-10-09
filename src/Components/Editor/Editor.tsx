import classNames from "classnames";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";

themes.vsDark.plain.backgroundColor = "#222224";

export const Editor = ({
  code,
  scope,
  name,
  noInline = false,
}: {
  code: string;
  scope?: Record<string, unknown>;
  name?: string;
  noInline?: boolean;
}) => {
  return (
    <LiveProvider
      code={code}
      scope={scope}
      enableTypeScript={true}
      theme={themes.vsDark}
      noInline={noInline}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-3">
          <LiveEditor />
        </div>
        <div className={classNames(name ? `p_${name}` : "col-span-1 rounded")}>
          <LivePreview />
        </div>
      </div>
      <LiveError />
    </LiveProvider>
  );
};
