import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { UnoptimizedPrimitive } from "../Introduction/Primitives";

// const code = `
//   render(() => <strong>Hello World!</strong>)
// `;

export const Editor = ({
  code,
  scope,
}: {
  code: string;
  scope?: Record<string, unknown>;
}) => {
  return (
    <LiveProvider code={code} scope={scope} noInline={true} enableTypeScript>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
          gap: "1rem",
        }}
      >
        <LiveEditor />
        <LivePreview />
      </div>
      <LiveError />
    </LiveProvider>
  );
};
