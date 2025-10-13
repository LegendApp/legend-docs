import { Header } from './Header';
import { Text } from './Text';

export function PlatformSection() {
    const platforms = [
        { name: 'iOS', icon: '📱', color: 'bg-blue-600', desc: 'Native performance' },
        { name: 'Android', icon: '🤖', color: 'bg-green-600', desc: 'Material Design ready' },
        { name: 'Web', icon: '🌐', color: 'bg-purple-600', desc: 'Browser optimized' },
        { name: 'macOS', icon: '🖥️', color: 'bg-zinc-600', desc: 'Desktop native' },
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
                        One codebase, every platform. Legend List delivers consistent performance across iOS, Android,
                        Web, macOS, Windows, and even TV platforms
                    </Text>
                </div>

                {/* Platform grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
                    {platforms.map((platform, index) => (
                        <div
                            key={platform.name}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors"
                        >
                            <div className="text-4xl mb-3">{platform.icon}</div>
                            <Header size="h4" className="text-lg mb-2">
                                {platform.name}
                            </Header>
                            <Text className="text-xs text-white/60">{platform.desc}</Text>
                        </div>
                    ))}
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
