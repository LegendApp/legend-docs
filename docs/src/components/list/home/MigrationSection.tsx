import { Header } from './Header';
import { Text } from './Text';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

export function MigrationSection() {
    const flatListDiff = `return (
-  <FlatList
+  <LegendList
    data={items}
    renderItem={({ item }) => <Text>{item.title}</Text>}
+   recycleItems
  />
)`;

    const flashListDiff = `return (
-  <FlashList
+  <LegendList
    data={items}
    renderItem={({ item }) => <Text>{item.title}</Text>}
    recycleItems
  />
)`;

    const scrollViewDiff = `return (
-  <ScrollView>
-    {items.map((item) => (
-      <Text key={item.id}>{item.title}</Text>
-    ))}
-  </ScrollView>
+  <LegendList data={items}>
+    {(item) => (
+      <Text key={item.id}>{item.title}</Text>
+    )}
+  </LegendList>
)`;

    return (
        <div className="mt-section px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <Header size="h2" className="text-4xl sm:text-5xl mb-6">
                        Simple to Switch
                    </Header>
                    <Text className="text-xl max-w-3xl mx-auto mb-8">
                        Drop-in replacement with zero breaking changes. Just change the import and get instant
                        performance improvements.
                    </Text>
                </div>

                {/* Migration examples */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* FlatList */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3">
                            <Text className="text-sm text-white/70 font-mono">From FlatList</Text>
                        </div>
                        <div className="p-4">
                            <DynamicCodeBlock code={flatListDiff} lang="diff" />
                        </div>
                    </div>

                    {/* FlashList */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3">
                            <Text className="text-sm text-white/70 font-mono">From FlashList</Text>
                        </div>
                        <div className="p-4">
                            <DynamicCodeBlock code={flashListDiff} lang="diff" />
                        </div>
                    </div>

                    {/* ScrollView */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-4 py-3">
                            <Text className="text-sm text-white/70 font-mono">From ScrollView</Text>
                        </div>
                        <div className="p-4">
                            <DynamicCodeBlock code={scrollViewDiff} lang="diff" />
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="mt-12 grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <div className="text-2xl">⚡</div>
                        </div>
                        <Header size="h4" className="text-xl mb-2">
                            Instant Speed Boost
                        </Header>
                        <Text className="text-white/70">10x faster performance with the exact same props and API</Text>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <div className="text-2xl">🔄</div>
                        </div>
                        <Header size="h4" className="text-xl mb-2">
                            Zero Breaking Changes
                        </Header>
                        <Text className="text-white/70">Works with your existing code, props, and styling</Text>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <div className="text-2xl">🚀</div>
                        </div>
                        <Header size="h4" className="text-xl mb-2">
                            More Features
                        </Header>
                        <Text className="text-white/70">
                            Bidirectional scrolling, better memory management, and more
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
}
