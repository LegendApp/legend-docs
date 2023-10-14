import { useRef } from "react";
import { Editor } from "shared/src/Components/Editor/Editor";
import { Memo, Switch } from "@legendapp/state/react";
import { pageHash } from "@legendapp/state/helpers/pageHash";
import { pageHashParams } from "@legendapp/state/helpers/pageHashParams";
import { Box } from "shared/src/Components/Box";
import { Button } from "shared/src/Components/Button";

const ROUTER_CODE = `
import { useRef } from "react";
import { Memo, Switch } from "@legendapp/state/react";
import { pageHash } from "@legendapp/state/helpers/pageHash";
import { pageHashParams } from "@legendapp/state/helpers/pageHashParams";

function RouterExample() {
  const renderCount = ++useRef(0).current;

  return (
    <Box width={240}>
      <div>Renders: {renderCount}</div>
      <div>
        <Button onClick={() => pageHashParams.page.delete()}>
          Go to root
        </Button>
        <Button onClick={() => pageHashParams.page.set('')}>
          Go to Page
        </Button>
        <Button onClick={() => pageHashParams.page.set('Home')}>
          Go Home
        </Button>
        <Button onClick={() => pageHashParams.page.set('asdf')}>
          Go to unknown
        </Button>
      </div>
        <div>Hash: <Memo>{pageHash}</Memo></div>
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
    </Box>
  );
}
`;

export function RouterComponent() {
  return (
    <Editor
      code={ROUTER_CODE}
      scope={{ useRef, Memo, pageHash, pageHashParams, Switch, Box, Button }}
      noInline={true}
      renderCode=";render(<RouterExample />)"
    />
  );
}
