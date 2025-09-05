import { Header } from './Header';
import { Text } from './Text';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

export function LazyListSection() {
  const renderItemCode = `<LegendList 
  data={items}
  renderItem={({ item, index }) => (
    <View key={item.id}>
      <Text>{item.name}</Text>
      <Button onPress={() => handle(item)} />
    </View>
  )}
/>`;

  const lazyListCode = `<LegendList data={items}>
  {(item, index) => (
    <View key={item.id}>
      <Text>{item.name}</Text>
      <Button onPress={() => handle(item)} />
    </View>
  )}
</LegendList>`;

  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Lazy List - Pass Children Instead of renderItem
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            LegendList supports both traditional renderItem prop and a revolutionary 
            children approach for cleaner code and better TypeScript support.
          </Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* renderItem prop */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-white/5 border-b border-white/10 px-6 py-4">
              <Header size="h3" className="text-xl">With renderItem prop</Header>
              <Text className="text-sm text-white/60">Traditional approach</Text>
            </div>
            
            <div className="p-6">
              <DynamicCodeBlock 
                code={renderItemCode}
                lang="jsx"
              />
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-white/70 text-sm">Familiar renderItem pattern</Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-white/70 text-sm">Drop-in FlatList replacement</Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-white/70 text-sm">Works with existing code</Text>
                </div>
              </div>
            </div>
          </div>

          {/* Children approach */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-white/5 border-b border-white/10 px-6 py-4">
              <Header size="h3" className="text-xl">With children</Header>
              <Text className="text-sm text-white/60">Modern JSX composition</Text>
            </div>
            
            <div className="p-6">
              <DynamicCodeBlock 
                code={lazyListCode}
                lang="jsx"
              />
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-white/70 text-sm">Direct JSX composition</Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-white/70 text-sm">Better TypeScript inference</Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <Text className="text-white/70 text-sm">Easier component composition</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}