import { observable, observe } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { For, observer, Reactive, useIsMounted, useObservable } from "@legendapp/state/react";
import { configureSynced, synced, syncObservable } from "@legendapp/state/sync";
import classNames from "classnames";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";
import { Checkbox } from "shared/src/Components/Checkbox";
import { Editor } from "shared/src/Components/Editor/Editor";
import { ThemeButton } from "shared/src/Components/ThemeButton";
import { state$ } from "shared/src/state";

const GETTING_STARTED_CODE = `
import { observable, Observable } from "@legendapp/state"
import { configureSynced, synced } from "@legendapp/state/sync"
import { observer, Reactive, useObservable } from "@legendapp/state/react"
import { ObservablePersistAsyncStorage } from
    "@legendapp/state/persist-plugins/async-storage"

interface Todo {
    id: number;
    text: string;
    completed?: boolean;
}

interface Store {
    todos: Todo[];
    total: number;
    numCompleted: number;
    addTodo: () => void;
}

interface TodoItemProps {
    item$: Observable<Todo>;
}

// Setup a configured persist options
const mySynced = configureSynced(synced, {
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage
    })
  }
})

// Create a global observable for the Todos
let nextId = 0;
const store$ = observable<Store>({
  todos: mySynced({
    initial: [],
    persist: {
      name: 'getting-started'
    },
  }),
  // Computeds
  total: (): number => {
    return store$.todos.length;
  },
  numCompleted: (): number => {
    return store$.todos.get().filter((todo) => todo.completed).length;
  },
  addTodo: () => {
    const todo: Todo = {
      id: nextId++,
      text: "",
    };
    store$.todos[todo.id].set(todo);
  },
});

// Receives item$ prop from the For component
function TodoItem({ item$ }: TodoItemProps) {
    const onKeyDown = (e) => {
        // Call addTodo from the global store$
        if (e.key === 'Enter') store$.addTodo()
    }

    // The child components are bound directly to the observable properties
    // so this component never has to re-render.
    return (
        <View className="row">
            <Checkbox $value={item$.completed} />
            <Reactive.TextInput
                $value={item$.text}
                onKeyDown={onKeyDown}
            />
        </View>
    );
}

const App = observer(function App() {
    const theme$ = useObservable<'light' | 'dark'>('dark')
    const theme = theme$.get()
    const total = store$.total.get()
    const completed = store$.numCompleted.get()

    return (
        <Box theme={theme}>
            <ThemeButton $value={theme$} />
            <Text>Total: {total}</Text>
            <Text>Completed: {completed}</Text>
            <For each={store$.todos} item={TodoItem} />
            <View className="flex justify-between">
                <Button onClick={() => store$.addTodo()}>Add</Button>
                <Button onClick={() => store$.todos.set({})}>Clear</Button>
            </View>
        </Box>
    )
})
`;

export const GettingStarted = observer(function GettingStarted() {
    const framework = state$.framework.get();
    const replacer = (str: string) =>
        str
            .replace(/<View|<Text/g, '<div')
            .replace(/<\/View|<\/Text/g, '</div')
            .replace(/,\n        asyncStorage: { AsyncStorage }/g, '')
            .replace(/observablePersistAsyncStorage\([^)]+\)/g, 'ObservablePersistLocalStorage')
            .replace(/ObservablePersistAsyncStorage/g, 'ObservablePersistLocalStorage')
            .replace(/TextInput/g, 'input')
            .replace(/async-storage/g, 'local-storage');

    const isMounted = useIsMounted().get();
    const displayCode = isMounted && framework === "React"
        ? replacer(GETTING_STARTED_CODE)
        : GETTING_STARTED_CODE;

  return (
    <Editor
      code={displayCode}
      scope={{
        observable,
        classNames,
        observe,
        observer,
        For,
        Button,
        Reactive,
        Box,
        Checkbox,
        useObservable,
        ThemeButton,
        configureSynced,
        syncObservable,
        synced,
        ObservablePersistLocalStorage,
      }}
      noInline
      renderCode=";render(<App />)"
      previewWidth={180}
      transformCode={(code) =>
        replacer(
          code
            .replace(
              /<Reactive\.(?:TextInput|input)/g,
              `<Reactive.input style={{ color: 'inherit' }} className="bg-white/10 text-inherit border rounded border-gray-500 px-2 py-1 ml-2 w-[120px]"`
            )
            .replace(/className="row"/g, 'className="flex items-center"')
            .replace("<Box>", "<Box theme={theme}>")
        )
      }
    />
  );
})

