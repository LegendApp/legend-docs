import { observer } from "@legendapp/state/react";
import classNames from "classnames";
import { BiPencil } from "react-icons/bi";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";

interface Props {
  code: string;
  scope?: Record<string, unknown>;
  name?: string;
  noInline?: boolean;
  renderCode?: string;
  previewWidth?: number;
  classNameEditor?: string;
  classNamePreview?: string;
  showEditing?: boolean;
  transformCode?: (code: string) => string;
}
const emptyTheme = { plain: {}, styles: [] };

function removeImports(code: string) {
  return code.replace(/import .*?\n/g, "");
}

export const Editor = observer(function Editor({
  code,
  scope,
  name,
  previewWidth,
  renderCode,
  classNameEditor,
  classNamePreview,
  transformCode,
  showEditing = true,
  noInline = false,
}: Props) {
  code = code.trim();
  return (
    <LiveProvider
      code={code}
      transformCode={(output) =>
        removeImports(
          (transformCode ? transformCode(output) : output) + (renderCode || "")
        )
      }
      scope={scope}
      enableTypeScript={true}
      theme={emptyTheme}
      noInline={noInline}
      language="tsx"
    >
      <div className="flex gap-4 text-sm mt-6 items-center">
        <div className={classNames("relative flex-1", classNameEditor)}>
          <div>
            <LiveEditor />
          </div>
          {showEditing && <div
            className={classNames(
              "absolute top-3 right-3 !mt-0 flex items-center bg-blue-700 px-2 py-1 rounded-md text-sm cursor-default"
            )}
          >
            <BiPencil className="mr-2" />
            Live Editing
          </div>}
        </div>
        <div
          className={classNames(name ? `p_${name}` : "col-span-1 rounded")}
          style={{ width: previewWidth }}
        >
          <LivePreview />
        </div>
      </div>
      <LiveError />
    </LiveProvider>
  );
});
