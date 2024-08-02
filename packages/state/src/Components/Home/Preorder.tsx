import { observer, useObservable } from "@legendapp/state/react";
import { Header } from "./Header";
import { Text } from "./Text";
import { Button } from "shared/src/Components/Button";

export const Preorder = observer(function Preorder() {
  const isPreordered$ = useObservable(false);
  const isPreordered = isPreordered$.get();

  const handlePreorder = () => {
    isPreordered$.set(true);
    // Add logic here to handle the preorder process
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <Header size="h1">Buy once, yours forever</Header>
        <Text>
          Lifetime access to an ever-growing library of helpers, components,
          hooks, example projects, and reactive components.
        </Text>
        <Text>
          Now available for pre-order at a discount for a limited time.
        </Text>
        <Text>Releasing shortly after Legend-State 3.0.</Text>
      </div>
      <div className="bg-white/15 rounded-xl p-8">
        <div className="line-through text-2xl text-white/50">$299</div>
        <div className="text-5xl !-mt-0">$199</div>
        <Text>
          Get lifetime access to everything in Legend Kit for a single one-time purchase, including all future updates.
        </Text>
        <Button onClick={handlePreorder}>
          {isPreordered ? "Preordered!" : "Preorder Now"}
        </Button>
      </div>
    </div>
  );
});
