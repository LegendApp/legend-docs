import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';
import { Memo, Reactive } from '@legendapp/state/react';
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useRef } from 'react';
import { Box } from 'shared/src/Components/Box';
import { Editor } from 'shared/src/Components/Editor/Editor';

const AUTO_SAVING_FORM_CODE = `
import axios from "axios"
import { useRef } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useObservable, useMemo, Reactive, Memo } from "@legendapp/state/react"
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents"
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';

function App() {
  const queryClient = useMemo(() => new QueryClient(), [])
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}

function Example() {
  const renderCount = ++useRef(0).current
  const lastSaved$ = useObservable(0)

  const { data } = useObservableSyncedQuery({
    query: {
      queryKey: ["data"],
      queryFn: () =>
        axios.get("https://reqres.in/api/users/1")
          .then((res) => res.data.data),
    },
    mutation: {
      mutationFn: (newData) => {
        // Uncomment to actually save
        /*
        debounce(() => {
          axios
            .post("https://reqres.in/api/users/1", newData)
            .then((res) =>
              lastSaved$.set(Date.now())
            )
        }, 1000)
        */
        lastSaved$.set(Date.now())
      }
    }
  })

  return (
    <Box>
      <div>
        Renders: {renderCount}
      </div>
      <div>Name:</div>
      <Reactive.input
        className="input"
        $value={data.first_name}
      />
      <div>Email:</div>
      <Reactive.input
        className="input"
        $value={data.email}
      />
      <div>
        Last saved: <Memo>{lastSaved$}</Memo>
      </div>
    </Box>
  )
}

let timeout = undefined;
function debounce(fn: () => void, time: number) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, time);
}
`;

export function AutoSavingFormComponent() {
    return (
        <Editor
            code={AUTO_SAVING_FORM_CODE}
            scope={{
                useRef,
                enableReactComponents,
                Reactive,
                QueryClient,
                QueryClientProvider,
                useObservableSyncedQuery,
                Memo,
                axios,
                Box,
                useMemo,
            }}
            noInline={true}
            renderCode=";render(<App />)"
            transformCode={(code) =>
                code.replace(
                    /className="input"/g,
                    'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2 mb-6"',
                )
            }
        />
    );
}
