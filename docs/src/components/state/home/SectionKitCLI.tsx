import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { CodeLine } from './CodeLine';
import { Header } from './Header';
import { Text } from './Text';

export function SectionKitCLI() {
    return (
        <div className="mt-subsection px-4">
            <Header size="h3">🛠️ A powerful CLI tool</Header>
            <Text className="max-w-4xl">
                The Legend Kit CLI makes it easy to enhance your projects with high-performance reactive components,
                observables, and hooks. Simply run a command and select what you need from our growing library of tools.
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 !mt-8">
                <div className="bg-tBg/30 border border-tBorder rounded-lg p-6">
                    <div className="text-xl font-semibold mb-3">Simplified Integration</div>
                    <Text>
                        Install exactly what you need with a simple command. Our CLI handles dependencies,
                        configurations, and setups so you can focus on building your app.
                    </Text>
                </div>

                <div className="bg-tBg/30 border border-tBorder rounded-lg p-6 !mt-0">
                    <div className="text-xl font-semibold mb-3">Fully Customizable</div>
                    <Text>
                        Each component, observable, and hook is added directly to your project so you can customize and
                        extend them to fit your specific requirements.
                    </Text>
                </div>

                <div className="bg-tBg/30 border border-tBorder rounded-lg p-6 !mt-0">
                    <div className="text-xl font-semibold mb-3">Free & Premium Tools</div>
                    <Text>
                        Browse and install from our collection of both free and premium tools. Unlock more powerful
                        features with your Legend Kit subscription.
                    </Text>
                </div>
            </div>

            <Header size="h4" className="pt-8">
                Install it now
            </Header>
            <Text>
                This will bootstrap and configure itself into your project, adding a &quot;legend&quot; script for easy
                access.
            </Text>

            <div className="mt-4 max-w-sm">
                <DynamicCodeBlock lang="bash" code="npx @legendapp/kit" />
            </div>

            <div className="mt-8 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
                <video autoPlay loop muted playsInline className="w-full h-auto">
                    <source src="/open-source/assets/legend-kit-cli.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}
