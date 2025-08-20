import { Header } from './Header';
import { Text } from './Text';

export function PlatformSection() {
  const platforms = [
    { name: 'iOS', icon: '📱', color: 'bg-blue-600', desc: 'Native performance' },
    { name: 'Android', icon: '🤖', color: 'bg-green-600', desc: 'Material Design ready' },
    { name: 'Web', icon: '🌐', color: 'bg-purple-600', desc: 'Browser optimized' },
    { name: 'macOS', icon: '🖥️', color: 'bg-gray-600', desc: 'Desktop native' },
    { name: 'Windows', icon: '💻', color: 'bg-cyan-600', desc: 'Desktop apps' },
    { name: 'TV', icon: '📺', color: 'bg-red-600', desc: 'Living room ready' },
  ];

  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Works on All Platforms
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            One codebase, every platform. Legend List delivers consistent performance 
            across iOS, Android, Web, macOS, Windows, and even TV platforms
          </Text>
        </div>

        {/* Platform grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {platforms.map((platform, index) => (
            <div key={platform.name} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-3">{platform.icon}</div>
              <Header size="h4" className="text-lg mb-2">{platform.name}</Header>
              <Text className="text-xs text-white/60">{platform.desc}</Text>
            </div>
          ))}
        </div>

        {/* Main platform comparison */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Web */}
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <div className="text-2xl">🌐</div>
              </div>
              <div>
                <Header size="h3" className="text-2xl">Web (React)</Header>
                <Text className="text-sm text-white/60">Desktop & mobile browsers</Text>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text>60 FPS scrolling</Text>
                <div className="w-24 bg-green-500 h-2 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <Text>Memory efficiency</Text>
                <div className="w-20 bg-green-500 h-2 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <Text>Bundle size</Text>
                <div className="w-12 bg-green-500 h-2 rounded-full"></div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <Text className="text-sm font-mono text-green-400">
                npm install @legendapp/list
              </Text>
              <Text className="text-xs text-white/60 mt-2">
                15KB gzipped • Tree-shakeable • SSR ready
              </Text>
            </div>
          </div>

          {/* Native */}
          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <div className="text-2xl">📱</div>
              </div>
              <div>
                <Header size="h3" className="text-2xl">Native (React Native)</Header>
                <Text className="text-sm text-white/60">iOS, Android, macOS, Windows, TV</Text>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text>Touch responsiveness</Text>
                <div className="w-24 bg-green-500 h-2 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <Text>Battery optimization</Text>
                <div className="w-20 bg-green-500 h-2 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <Text>Native performance</Text>
                <div className="w-24 bg-green-500 h-2 rounded-full"></div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <Text className="text-sm font-mono text-purple-400">
                expo install @legendapp/list
              </Text>
              <Text className="text-xs text-white/60 mt-2">
                Native modules • Platform-specific optimizations
              </Text>
            </div>
          </div>
        </div>

        {/* Platform-specific features */}
        <div className="mt-16">
          <Header size="h3" className="text-2xl mb-8 text-center">Platform-Specific Features</Header>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-3">📱 iOS & Android</div>
              <Header size="h4" className="text-lg mb-2">Mobile First</Header>
              <Text className="text-sm text-white/70">
                Touch gestures, native scrolling, battery optimization, and platform-specific UI patterns
              </Text>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-3">🖥️ Desktop</div>
              <Header size="h4" className="text-lg mb-2">macOS & Windows</Header>
              <Text className="text-sm text-white/70">
                Keyboard navigation, mouse wheel scrolling, desktop-specific interactions and styling
              </Text>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-2xl mb-3">📺 TV Platforms</div>
              <Header size="h4" className="text-lg mb-2">Living Room Apps</Header>
              <Text className="text-sm text-white/70">
                Remote control navigation, focus management, and TV-optimized user interfaces
              </Text>
            </div>
          </div>
        </div>

        {/* Key benefits */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Text className="text-sm">Same API everywhere</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Text className="text-sm">Platform-specific optimizations</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Text className="text-sm">Shared business logic</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}