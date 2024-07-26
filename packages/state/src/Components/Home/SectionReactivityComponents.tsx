import { CodeSample } from 'shared/src/Components/CodeSample';
import { SectionTitle } from "./Components";


const CodeDemoSubtitle = `
function Component() {
    return (
        <Memo>{count$}</Memo>
    )
}
`;

export const SectionReactivityComponents = () => {
  return (
    <div className="!mt-20 max-w-4xl mx-auto">
      <SectionTitle
        text="🚀 Reactive Components"
        description="A built-in set of control-flow components make it easy to isolate re-renders to only the tiniest element that changed."
      />
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="!mt-0">
          <div>Memo creates a tiny sub-component that re-renders itself</div>
          <CodeSample code={CodeDemoSubtitle} />
        </div>
        <div className="!mt-0">
          <div>For</div>
          <CodeSample code={CodeDemoSubtitle} />
        </div>
        <div className="!mt-0">
          <div>Show</div>
          <CodeSample code={CodeDemoSubtitle} />
        </div>
        <div className="!mt-0">
          <div>Switch</div>
          <CodeSample code={CodeDemoSubtitle} />
        </div>
      </div>
    </div>
  );
};
