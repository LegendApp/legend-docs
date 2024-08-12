import { observer, useObservable } from '@legendapp/state/react';
import { Header } from './Header';
import { Text } from './Text';
import { PreorderButton } from './PreorderButton';

export const Preorder = observer(function Preorder() {
    return (
        <div className="sm:flex items-center gap-8 mt-section px-4">
            <div className="flex-1">
                <div className="max-w-lg">
                    <Header size="h1">Buy once, yours forever</Header>
                    <Text>
                        Lifetime access to an ever-growing library of helpers, components, hooks, example projects, and
                        reactive components.
                    </Text>
                    <Text>Now available for pre-order at a discount for a limited time.</Text>
                    <Text>Releasing shortly after Legend-State 3.0.</Text>
                </div>
            </div>
            <div className="rounded-xl p-8 border border-tBorder bg-gradient-to-br from-[#d556e3] to-[#3c59fd] max-w-sm mx-auto !mt-8 sm:!mt-0">
                <Header size="h2">Legend Kit</Header>
                <Text>
                    Get lifetime access to everything in Legend Kit for a single one-time purchase, including all future
                    updates. Preorder now to save $100 and accelerate Legend Kit's development.
                </Text>
                <div className="text-5xl !mt-8">$199</div>
                <Text className="!mt-2">
                    <span className="line-through">$299</span>
                    <span> Save $100 with preorder</span>
                </Text>
                <PreorderButton color="white" className="!mt-8">
                    Preorder Now
                </PreorderButton>
            </div>
        </div>
    );
});
