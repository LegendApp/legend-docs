import { useRef } from 'react';
import { useObservable, useObserve, Memo, Show } from '@legendapp/state/react';
import { Editor } from 'shared/src/Components/Editor/Editor';
import { Box } from 'shared/src/Components/Box';
import { Button } from 'shared/src/Components/Button';
import { $React } from '@legendapp/state/react-web';

const FORM_VALIDATION_CODE = `
import { useRef } from "react"
import { useObservable, useObserve, Reactive, Memo, Show } from "@legendapp/state/react"

function App() {
  const renderCount = ++useRef(0).current

  const username$ = useObservable('')
  const password$ = useObservable('')
  const usernameError$ = useObservable('')
  const passwordError$ = useObservable('')
  const didSave$ = useObservable(false)
  const successMessage$ = useObservable('')

  useObserve(() => {
    if (didSave$.get()) {
      usernameError$.set(username$.get().length < 3 ?
        'Username must be > 3 characters' :
        ''
      )
      const pass = password$.get()
      passwordError$.set(
        pass.length < 10 ?
          'Password must be > 10 characters' :
          !pass.match(/\d/) ?
            'Password must include a number' :
            ''
      )
    }
  })

  const onClickSave = () => {
    // setting triggers useObserve, updating error messages
    didSave$.set(true)

    if (!usernameError$.get() && !passwordError$.get()) {
      console.log('Submit form')
      passwordError$.delete()
      successMessage$.set('Saved!')
    }
  }

  return (
    <Box>
      <div>Renders: {renderCount}</div>
      <div>Username:</div>
      <$React.input
        className="input"
        $value={username$}
      />
      <div className="error">
        <Memo>{usernameError$}</Memo>
      </div>
      <div>Password:</div>
      <$React.input
        type="password"
        className="input"
        $value={password$}
      />
      <div className="error">
        <Memo>{passwordError$}</Memo>
      </div>
      <Show if={successMessage$}>
        {() => (
          <div>
            {successMessage$.get()}
          </div>
        )}
      </Show>
      <Button onClick={onClickSave}>
        Save
      </Button>
    </Box>
  )
}
`;

export function FormValidationComponent() {
    return (
        <Editor
            code={FORM_VALIDATION_CODE}
            scope={{
                useRef,
                $React,
                useObservable,
                useObserve,
                Memo,
                Show,
                Box,
                Button,
            }}
            noInline={true}
            previewWidth={200}
            renderCode=";render(<App />)"
            transformCode={(code) =>
                code
                    .replace(
                        /className="input"/g,
                        'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2"',
                    )
                    .replace(/className="error"/g, 'className="text-sm text-red-500 mb-2 h-10 pt-1"')
            }
        />
    );
}
