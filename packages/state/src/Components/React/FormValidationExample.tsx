import { useRef } from "react";
import {
  useObservable,
  useObserve,
  Reactive,
  Memo,
  Show,
} from "@legendapp/state/react";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { Editor } from "../Editor/Editor";

const FORM_VALIDATION_CODE = `enableReactComponents()

function App() {
  const renderCount = ++useRef(0).current

  const username = useObservable('')
  const password = useObservable('')
  const usernameError = useObservable('')
  const passwordError = useObservable('')
  const didSave = useObservable(false)
  const successMessage = useObservable('')

  useObserve(() => {
    if (didSave.get()) {
      usernameError.set(username.get().length < 3 ?
        'Username must be > 3 characters' :
        ''
      )

      const pass = password.get()
      passwordError.set(
        pass.length < 10 ?
          'Password must be > 10 characters' :
          !pass.match(/\d/) ?
            'Password must include a number' :
            ''
      )
    }
  })

  const onClickSave = () => {
    // changing didSave runs useObserve immediately, updating error messages
    didSave.set(true)

    if (!usernameError.get() && !passwordError.get()) {
      console.log('Submit form')
      passwordError.delete();
      successMessage.set('Saved!')
    }
  }

  return (
    <div className="p-4 bg-slate-800">
      <div className="text-gray-500 text-sm pb-4">
        Renders: {renderCount}
      </div>
      <div>Username:</div>
      <Reactive.input
        className={classNameInput}
        $value={username}
      />
      <div className={classNameError}>
        <Memo>{usernameError}</Memo>
      </div>
      <div>Password:</div>
      <Reactive.input
        type="password"
        className={classNameInput}
        $value={password}
      />
      <div className={classNameError}>
        <Memo>{passwordError}</Memo>
      </div>
      <Show if={successMessage}>
        {() => (
          <div>
            {successMessage.get()}
          </div>
        )}
      </Show>
      <div>
        <button
          className="bg-gray-300 rounded-lg px-4 py-2 mt-6"
          onClick={onClickSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}

const classNameInput = "border rounded border-gray-300 px-2 py-1 mt-2"
const classNameError = "text-sm text-red-500 mb-2 h-5 pt-1"

render(<App />)
`;

export function FormValidationComponent() {
  return (
    <Editor
      code={FORM_VALIDATION_CODE}
      scope={{
        useRef,
        enableReactComponents,
        Reactive,
        useObservable,
        useObserve,
        Memo,
        Show,
      }}
      noInline={true}
    />
  );
}
