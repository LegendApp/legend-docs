import { observer } from '@legendapp/state/react';
import { Header } from './Header';
import { Text } from './Text';
import { PreorderButton } from './PreorderButton';

export const Preorder = observer(function Preorder() {
    const FullPrice = 399;
    const DiscountedPrice = 199;
    const Discount = FullPrice - DiscountedPrice;
    const DiscountPercentage = (Discount / FullPrice) * 100;
    return (
        <div className="sm:flex items-center gap-8 mt-section px-4">
            <div className="flex-1">
                <div className="max-w-lg">
                    <Header size="h1">Buy once, yours forever</Header>
                    <Text>
                        Lifetime access to an ever-growing library of helpers, components, hooks, example projects, and
                        reactive components.
                    </Text>
                    <Text>Now available with promotional launch pricing for a limited time.</Text>
                    <Text>
                        First version with CLI tools is available now, with more features coming soon after Legend-State
                        3.0.
                    </Text>
                </div>
            </div>
            <div className="rounded-xl p-8 border border-tBorder bg-gradient-to-br from-[#d556e3] to-[#3c59fd] max-w-sm mx-auto !mt-8 sm:!mt-0">
                <Header size="h2">Legend Kit</Header>
                <Text>
                    Get lifetime access to everything in Legend Kit for a single one-time purchase, including all future
                    updates. Get started now to save ${Discount} and accelerate Legend Kit&apos;s development.
                </Text>
                <div className="text-4xl !mt-8 line-through opacity-60">${FullPrice}</div>
                <div className="text-5xl !mt-2">${DiscountedPrice}</div>
                <Text className="!mt-2">
                    Save ${Discount} ({DiscountPercentage.toFixed(0)}% off) with promotional pricing!
                </Text>
                <PreorderButton color="white" className="!mt-8">
                    Get Started
                </PreorderButton>
            </div>
        </div>
    );
});