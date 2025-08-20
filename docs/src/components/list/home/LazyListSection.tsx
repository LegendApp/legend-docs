import { Header } from './Header';
import { Text } from './Text';

export function LazyListSection() {
  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Lazy List - Pass Children Instead of renderItem
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            Revolutionary approach that lets you write JSX directly instead of render functions. 
            Cleaner code with better TypeScript support and component composition.
          </Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Traditional renderItem */}
          <div className="bg-orange-900/10 border border-orange-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <Header size="h3" className="text-2xl text-orange-400">Traditional renderItem</Header>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-2">// Complex render function</div>
              <div className="text-blue-400">const</div>
              <div className="text-white"> renderItem = (</div>
              <div className="text-purple-400">&#123; item, index &#125;</div>
              <div className="text-white">) =&gt; &#123;</div>
              <div className="text-blue-400 ml-2">  return</div>
              <div className="text-white"> (</div>
              <div className="text-white ml-4">    &lt;</div>
              <div className="text-green-400">View</div>
              <div className="text-purple-400"> key</div>
              <div className="text-white">=&#123;item.id&#125;&gt;</div>
              <div className="text-white ml-6">      &lt;</div>
              <div className="text-green-400">Text</div>
              <div className="text-white">&gt;&#123;item.name&#125;&lt;/</div>
              <div className="text-green-400">Text</div>
              <div className="text-white">&gt;</div>
              <div className="text-white ml-6">      &lt;</div>
              <div className="text-green-400">Button</div>
              <div className="text-purple-400"> onPress</div>
              <div className="text-white">=&#123;() =&gt; handle(item)&#125; /&gt;</div>
              <div className="text-white ml-4">    &lt;/</div>
              <div className="text-green-400">View</div>
              <div className="text-white">&gt;</div>
              <div className="text-white ml-2">  );</div>
              <div className="text-white">&#125;;</div>
              
              <div className="mt-4">
                <div className="text-white">&lt;</div>
                <div className="text-green-400">FlatList</div>
                <div className="text-purple-400"> renderItem</div>
                <div className="text-white">=&#123;renderItem&#125; /&gt;</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <Text className="text-orange-400">Extra function overhead</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <Text className="text-orange-400">Harder to compose components</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <Text className="text-orange-400">TypeScript inference issues</Text>
              </div>
            </div>
          </div>

          {/* Lazy List with children */}
          <div className="bg-green-900/10 border border-green-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Header size="h3" className="text-2xl text-green-400">Lazy List with Children</Header>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-2">// Clean JSX composition</div>
              <div className="text-white">&lt;</div>
              <div className="text-green-400">LazyList</div>
              <div className="text-purple-400"> data</div>
              <div className="text-white">=&#123;items&#125;&gt;</div>
              <div className="text-white ml-2">  &#123;(</div>
              <div className="text-purple-400">item, index</div>
              <div className="text-white">) =&gt; (</div>
              <div className="text-white ml-4">    &lt;</div>
              <div className="text-green-400">View</div>
              <div className="text-purple-400"> key</div>
              <div className="text-white">=&#123;item.id&#125;&gt;</div>
              <div className="text-white ml-6">      &lt;</div>
              <div className="text-green-400">Text</div>
              <div className="text-white">&gt;&#123;item.name&#125;&lt;/</div>
              <div className="text-green-400">Text</div>
              <div className="text-white">&gt;</div>
              <div className="text-white ml-6">      &lt;</div>
              <div className="text-green-400">Button</div>
              <div className="text-purple-400"> onPress</div>
              <div className="text-white">=&#123;() =&gt; handle(item)&#125; /&gt;</div>
              <div className="text-white ml-4">    &lt;/</div>
              <div className="text-green-400">View</div>
              <div className="text-white">&gt;</div>
              <div className="text-white ml-2">  )&#125;</div>
              <div className="text-white">&lt;/</div>
              <div className="text-green-400">LazyList</div>
              <div className="text-white">&gt;</div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Text className="text-green-400">Direct JSX composition</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Text className="text-green-400">Perfect TypeScript support</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Text className="text-green-400">Component composition friendly</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16">
          <Header size="h3" className="text-2xl mb-8 text-center">Why Lazy List?</Header>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <Header size="h4" className="text-xl mb-3">Better DX</Header>
              <Text className="text-white/70">
                Write JSX naturally without render function overhead
              </Text>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🔧</div>
              <Header size="h4" className="text-xl mb-3">Type Safety</Header>
              <Text className="text-white/70">
                Full TypeScript inference for item props and state
              </Text>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🧩</div>
              <Header size="h4" className="text-xl mb-3">Composable</Header>
              <Text className="text-white/70">
                Easily nest and compose components within list items
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}