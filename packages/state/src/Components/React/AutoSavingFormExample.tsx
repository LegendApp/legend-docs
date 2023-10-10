import axios from "axios";
import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useObservable, Reactive, Memo } from "@legendapp/state/react";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { useObservableQuery } from "@legendapp/state/react-hooks/useObservableQuery";
import { Editor } from "shared/src/Components/Editor/Editor";

const AUTO_SAVING_FORM_CODE = `let timeout = 0
function debounce(fn, time) {
  clearTimeout(timeout)
  timeout = setTimeout(fn, time)
}

enableReactComponents()

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
  const { data } = useObservableQuery(
    {
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
  const lastSaved = useObservable(0)

  return (
    <div className="p-4 bg-slate-800">
      <div className="text-gray-500 text-sm pb-4">
        Renders: {renderCount}
      </div>
      <div>Name:</div>
      <Reactive.input
        className={classNameInput}
        $value={data.first_name}
      />
      <div>Email:</div>
      <Reactive.input
        className={classNameInput}
        $value={data.email}
      />
      <div>
        Last saved: <Memo>{lastSaved}</Memo>
      </div>
    </div>
  )
}

const classNameInput = "border rounded border-gray-300 px-2 py-1 mt-2 mb-4"

render(<App />)
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
        useObservableQuery,
        useObservable,
        Memo,
        axios,
      }}
      noInline={true}
    />
  );
}
