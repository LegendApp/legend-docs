import axios from "axios";
import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useObservable, Reactive, Memo } from "@legendapp/state/react";
import { useObservableQuery } from "@legendapp/state/react-hooks/useObservableQuery";
import { Editor } from "shared/src/Components/Editor/Editor";
import { Box } from "shared/src/Components/Box";

let timeout: any;
function debounce(fn: () => void, time: number) {
  clearTimeout(timeout)
  timeout = setTimeout(fn, time)
}
const AUTO_SAVING_FORM_CODE = `
import axios from "axios"
import { useRef } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useObservable, Reactive, Memo } from "@legendapp/state/react"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}

function Example() {
  const renderCount = ++useRef(0).current
  const { data } = useObservableQuery({
      queryKey: ["data"],
      queryFn: () =>
        axios.get("https://reqres.in/api/users/1")
          .then((res) => res.data.data),
    },
    {
      mutationFn: (newData) => {
        // Uncomment to actually save
        /*
        debounce(() => {
          axios
            .post("https://reqres.in/api/users/1", newData)
            .then((res) =>
              lastSaved.set(Date.now())
            )
        }, 1000)
        */
        lastSaved.set(Date.now())
      }
    }
  )
  const lastSaved$ = useObservable(0)

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
`;

export function AutoSavingFormComponent() {
  return (
    <Editor
      code={AUTO_SAVING_FORM_CODE}
      scope={{
        useRef,
        Reactive,
        QueryClient,
        QueryClientProvider,
        useObservableQuery,
        useObservable,
        Memo,
        axios,
        Box,
        debounce,
      }}
      noInline={true}
      renderCode=";render(<App />)"
      transformCode={(code) =>
        code.replace(
          /className="input"/g,
          'className="bg-gray-900 text-white border rounded border-gray-600 px-2 py-1 mt-2 mb-6"'
        )
      }
    />
  );
}
