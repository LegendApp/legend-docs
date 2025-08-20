import { Header } from './Header';
import { Text } from './Text';

export function MigrationSection() {
  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Simple to Switch from FlatList
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            Drop-in replacement for FlatList with zero breaking changes. 
            Just import and get instant performance improvements.
          </Text>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Before - FlatList */}
          <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <Header size="h3" className="text-2xl text-red-400">Before - FlatList</Header>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-400 mb-2">// Slow performance, limited features</div>
              <div className="text-blue-400">import</div>
              <div className="text-white"> &#123; </div>
              <div className="text-green-400">FlatList</div>
              <div className="text-white"> &#125; </div>
              <div className="text-blue-400">from</div>
              <div className="text-yellow-400"> 'react-native'</div>
              <div className="text-white">;</div>
              
              <div className="mt-4">
                <div className="text-white">&lt;</div>
                <div className="text-green-400">FlatList</div>
                <div className="text-white"></div>
                <div className="text-purple-400">  data</div>
                <div className="text-white">=&#123;items&#125;</div>
                <div className="text-purple-400">  renderItem</div>
                <div className="text-white">=&#123;renderItem&#125;</div>
                <div className="text-purple-400">  keyExtractor</div>
                <div className="text-white">=&#123;keyExtractor&#125;</div>
                <div className="text-white">/&gt;</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <Text className="text-red-400">Janky scrolling on large lists</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <Text className="text-red-400">No bidirectional infinite scroll</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <Text className="text-red-400">Memory issues with large datasets</Text>
              </div>
            </div>
          </div>

          {/* After - Legend List */}
          <div className="bg-green-900/10 border border-green-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Header size="h3" className="text-2xl text-green-400">After - Legend List</Header>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-gray-400 mb-2">// Same API, 10x faster performance</div>
              <div className="text-blue-400">import</div>
              <div className="text-white"> &#123; </div>
              <div className="text-green-400">FlatList</div>
              <div className="text-white"> &#125; </div>
              <div className="text-blue-400">from</div>
              <div className="text-yellow-400"> '@legendapp/list'</div>
              <div className="text-white">;</div>
              
              <div className="mt-4">
                <div className="text-white">&lt;</div>
                <div className="text-green-400">FlatList</div>
                <div className="text-white"></div>
                <div className="text-purple-400">  data</div>
                <div className="text-white">=&#123;items&#125;</div>
                <div className="text-purple-400">  renderItem</div>
                <div className="text-white">=&#123;renderItem&#125;</div>
                <div className="text-purple-400">  keyExtractor</div>
                <div className="text-white">=&#123;keyExtractor&#125;</div>
                <div className="text-white">/&gt;</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Text className="text-green-400">Buttery smooth 60fps scrolling</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Text className="text-green-400">Built-in infinite scroll both ways</Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Text className="text-green-400">Intelligent memory management</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Migration steps */}
        <div className="mt-16 text-center">
          <Header size="h3" className="text-2xl mb-8">Migration in 3 steps</Header>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <Header size="h4" className="text-lg mb-2">Install</Header>
              <Text className="text-sm text-white/70">
                npm install @legendapp/list
              </Text>
            </div>
            
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <Header size="h4" className="text-lg mb-2">Replace Import</Header>
              <Text className="text-sm text-white/70">
                Change import source to @legendapp/list
              </Text>
            </div>
            
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <Header size="h4" className="text-lg mb-2">Done!</Header>
              <Text className="text-sm text-white/70">
                Enjoy 10x faster performance
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}