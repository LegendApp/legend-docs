import { Header } from './Header';
import { Text } from './Text';

export function PowerfulListsSection() {
    return (
        <div className="mt-section px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <Header size="h2" className="text-4xl sm:text-5xl mb-6">
                        Built for Powerful Lists
                    </Header>
                    <Text className="text-xl max-w-3xl mx-auto">
                        From simple data lists to complex AI chat interfaces, Legend List handles the most demanding use
                        cases with ease
                    </Text>
                </div>

                <div className="lg:flex items-center gap-16">
                    {/* Demo video */}
                    <div className="flex-1 mb-12 lg:mb-0">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <video autoPlay loop muted playsInline className="w-full h-auto">
                                <source src="open-source/assets/legendlist1.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <Text className="text-sm text-white/50 text-center mt-4">
                            Real AI chat app built with Legend List
                        </Text>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <Header size="h3" className="text-3xl mb-8">
                            Perfect for Complex Apps
                        </Header>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                    <div className="text-2xl">💬</div>
                                </div>
                                <div>
                                    <Header size="h4" className="text-lg mb-2">
                                        AI Chat Interfaces
                                    </Header>
                                    <Text className="text-white/70">
                                        Bidirectional infinite scrolling for chat history, smooth message streaming, and
                                        intelligent memory management for long conversations
                                    </Text>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                                    <div className="text-2xl">📱</div>
                                </div>
                                <div>
                                    <Header size="h4" className="text-lg mb-2">
                                        Social Media Feeds
                                    </Header>
                                    <Text className="text-white/70">
                                        Handle millions of posts with variable heights, embedded media, and real-time
                                        updates without performance degradation
                                    </Text>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                                    <div className="text-2xl">📊</div>
                                </div>
                                <div>
                                    <Header size="h4" className="text-lg mb-2">
                                        Data Tables & Analytics
                                    </Header>
                                    <Text className="text-white/70">
                                        Large datasets with complex filtering, sorting, and real-time updates. Perfect
                                        for admin dashboards and analytics tools
                                    </Text>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-cyan-600/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                                    <div className="text-2xl">🛒</div>
                                </div>
                                <div>
                                    <Header size="h4" className="text-lg mb-2">
                                        E-commerce Catalogs
                                    </Header>
                                    <Text className="text-white/70">
                                        Product listings with images, dynamic pricing, and instant search. Smooth
                                        scrolling through thousands of products
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key features for powerful lists */}
                <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">♾️</div>
                        <Header size="h4" className="text-lg mb-2">
                            Bidirectional
                        </Header>
                        <Text className="text-sm text-white/70">Load in both directions</Text>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🔄</div>
                        <Header size="h4" className="text-lg mb-2">
                            Real-time
                        </Header>
                        <Text className="text-sm text-white/70">Live updates & streaming</Text>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">📏</div>
                        <Header size="h4" className="text-lg mb-2">
                            Dynamic Heights
                        </Header>
                        <Text className="text-sm text-white/70">Variable item sizes</Text>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🧠</div>
                        <Header size="h4" className="text-lg mb-2">
                            Smart Memory
                        </Header>
                        <Text className="text-sm text-white/70">Efficient virtualization</Text>
                    </div>
                </div>
            </div>
        </div>
    );
}
