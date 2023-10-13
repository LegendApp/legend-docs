import { useObservable, observer } from "@legendapp/state/react";
import classNames from "classnames";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";
import { BiPencil } from "react-icons/bi";

themes.vsDark.plain.backgroundColor = "#222224";

interface Props {
  code: string;
  simpleCode?: string;
  scope?: Record<string, unknown>;
  name?: string;
  noInline?: boolean;
}

export const Editor = observer(
  ({ code, simpleCode, scope, name, noInline = false }: Props) => {
    code = code.trim();
    simpleCode = simpleCode?.trim();
    const isEditing$ = useObservable(!simpleCode);
    const isEditing = isEditing$.get();
    return (
      <LiveProvider
        code={isEditing ? code : simpleCode}
        transformCode={(output) => (isEditing ? output : code)}
        scope={scope}
        enableTypeScript={true}
        theme={themes.vsDark}
        noInline={noInline}
        disabled={!isEditing}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-3 relative">
            <LiveEditor />
            {simpleCode && (
              <div
                className="absolute top-3 right-3 !mt-0 flex items-center bg-blue-700 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-600"
                onClick={isEditing$.toggle}
              >
                <BiPencil className="mr-2" />
                {isEditing ? "Editing" : "Edit"}
              </div>
            )}
          </div>
          <div
            className={classNames(name ? `p_${name}` : "col-span-1 rounded")}
          >
            <LivePreview />
          </div>
        </div>
        <LiveError />
      </LiveProvider>
    );
  }
);
