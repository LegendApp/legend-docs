import { observable } from "@legendapp/state";
import {
  Memo,
  Reactive,
  observer,
  useObservable,
} from "@legendapp/state/react";
import { useRef } from "react";
import { Button } from "./Button";
import { Editor } from "./Editor/Editor";
import { useInterval } from "usehooks-ts";

export function CodeSample({
  code,
  scope,
}: {
  code: string;
  scope?: Record<string, unknown>;
}) {
  return (
    <Editor
      code={code}
      noInline
      renderCode={`;function Component(){};render(<div><Component /></div>)`}
      previewWidth={360}
      showEditing={false}
      scope={{
        useRef,
        useObservable,
        Button,
        Memo,
        observable,
        Reactive,
        observer,
        useInterval,
        ...(scope || {})
      }}
      classNameEditor="home-editor"
      hideDemo
    />
  );
}
