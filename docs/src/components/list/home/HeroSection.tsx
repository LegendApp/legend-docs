import { Header } from './Header';
import { Text } from './Text';
import { Button } from './Button';
import Link from 'next/link';

export function HeroSection() {
    return (
        <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 blur-3xl"></div>

            {/* Content */}
            <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-12">
                <div className="text-center">
                    <Header
                        size="h1"
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8"
                    >
                        Legend List
                    </Header>

                    <Text className="text-xl sm:text-2xl max-w-4xl mx-auto mb-4">
                        The fastest, most powerful list library for React and React Native
                    </Text>

                    <Text className="text-lg max-w-3xl mx-auto mb-12 text-white/60">
                        Build complex apps like AI chat interfaces with bidirectional infinite scrolling,
                        virtualization, and blazing-fast performance on both mobile and web
                    </Text>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <Link href="/list/docs/v2/getting-started" className="no-underline">
                            <Button
                                color="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                                size="large"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Performance Video */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <video autoPlay loop muted playsInline className="w-full h-auto">
                            <source src="/assets/legendlist1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <Text className="text-sm text-white/50 text-center mt-4">
                        See the performance difference in action
                    </Text>
                </div>
            </div>
        </div>
    );
}
