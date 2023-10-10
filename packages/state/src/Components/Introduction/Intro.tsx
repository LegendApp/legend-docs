import { observable } from "@legendapp/state";
import { enableReactUse } from "@legendapp/state/config/enableReactUse";
import { Editor } from "shared/src/Components/Editor/Editor";
import classNames from "classnames";

const INTRO_EXAMPLE_CODE = `
enableReactUse()
const state = observable({exampleTheme: 'light' });

function Intro() {
  const theme = state.exampleTheme.use();

  return (
      <div style={{ width: 180 }}>
          <div
              className={classNames(
                  'flex flex-col items-center p-4 mt-4 rounded-lg',
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100 text-gray-800'
              )}
          >
              <div className="font-medium">
                  Theme: <span className="font-bold text-blue-accent">{theme}</span>
              </div>

              <button
                  className={classNames(
                      'block px-4 py-2 my-4 font-bold rounded shadow text-2xs',
                      theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'shadow-gray-400 hover:bg-gray-300'
                  )}
                  onClick={() => state.exampleTheme.set((v) => (v === 'light' ? 'dark' : 'light'))}
              >
                  Toggle theme
              </button>
          </div>
      </div>
  );
}

render(<Intro />)
`;

export function IntroExampleComponent() {
  return (
    <Editor
      code={INTRO_EXAMPLE_CODE}
      scope={{ observable, classNames, enableReactUse }}
      noInline={true}
    />
  );
}
