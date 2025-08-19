import { Header } from './Header';
import { PreorderButton } from './PreorderButton';
import { Text } from './Text';

export function SectionKitHeader() {
    return (
        <div className="mt-section text-center px-4">
            <Header
                size="h1"
                className="!text-3xl sm:!text-h1 !font-bold !leading-tight max-w-4xl text-center mx-auto !mt-4"
            >
                Legend Kit
            </Header>
            <Text className="text-xl max-w-3xl mx-auto text-left">
                Both an expertly crafted collection of tools and an intelligent coding assistant, it&apos;s the perfect
                starting point to build great apps even faster.
            </Text>

            <div className="!mt-8 text-center flex flex-col justify-center items-center">
                <div className="border-tBorder border p-6 rounded-lg bg-tBg">
                    <Text className="text-white/60 text-sm">One time purchase</Text>
                    <Text className="text-white/60 text-sm !mt-1 pb-2">Promotional launch pricing</Text>
                    <PreorderButton color="gradient" className="mx-auto">
                        Get started for $199
                    </PreorderButton>
                    <Text className="text-white/60 !mt-0 text-sm pt-2">Lifetime access</Text>
                </div>
            </div>
        </div>
    );
}