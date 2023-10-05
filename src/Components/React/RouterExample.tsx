import { useRef } from "react";
import { Editor } from "../Editor/Editor";
import { Memo, Switch } from "@legendapp/state/react";
import { pageHash } from "@legendapp/state/helpers/pageHash";
import { pageHashParams } from "@legendapp/state/helpers/pageHashParams";

const ROUTER_CODE = `function RouterExample() {
  const renderCount = ++useRef(0).current;

  return (
      <div className="text-md bg-slate-800 p-4" style={{ width: 300 }}>
          <div>Renders: {renderCount}</div>
          <div className="">
              <button
                  className="block px-4 py-2 my-2 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
                  onClick={() => pageHashParams.page.delete()}
              >
                  Go to root
              </button>
              <button
                  className="block px-4 py-2 my-2 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
                  onClick={() => pageHashParams.page.set('')}
              >
                  Go to Page
              </button>
              <button
                  className="block px-4 py-2 my-2 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
                  onClick={() => pageHashParams.page.set('Home')}
              >
                  Go Home
              </button>
              <button
                  className="block px-4 py-2 my-2 font-bold bg-gray-700 rounded shadow text-2xs hover:bg-gray-600 active:bg-gray-500"
                  onClick={() => pageHashParams.page.set('asdf')}
              >
                  Go to unknown
              </button>
          </div>
          <div className="my-4 text-xs">
              <div className='py-4'>Hash: <Memo>{pageHash}</Memo></div>
              <div className="p-4 bg-gray-600 rounded-xl">
                  <Switch value={pageHashParams.page}>
                      {{
                          undefined: () => <div>Root</div>,
                          '': () => <div>Page</div>,
                          Home: () => <div>Home</div>,
                          default: () => <div>Unknown page</div>,
                      }}
                  </Switch>
              </div>
          </div>
      </div>
  );
}

render(<RouterExample />)
`;

export function RouterComponent() {
  return (
    <Editor
      code={ROUTER_CODE}
      scope={{ useRef, Memo, pageHash, pageHashParams, Switch }}
    />
  );
}
