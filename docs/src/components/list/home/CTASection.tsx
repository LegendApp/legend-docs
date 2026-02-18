import { Header } from './Header';
import { Text } from './Text';
import { Button } from './Button';
import Link from 'next/link';
import { getFirstDocsPath } from '@/lib/getDocsPath';

export function CTASection() {
    return (
        <div className="mt-section px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 border border-white/10 rounded-3xl p-12 text-center">
                    <Header size="h2" className="text-3xl sm:text-4xl mb-6">
                        Ready to Build Amazing Lists?
                    </Header>

                    <Text className="text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of developers building fast, beautiful list experiences with Legend List. Get
                        started in minutes.
                    </Text>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Link href={getFirstDocsPath('list')} className="no-underline">
                            <Button
                                color="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                                size="large"
                            >
                                Get Started Now
                            </Button>
                        </Link>

                        <Link href="https://github.com/LegendApp/legend-list" className="no-underline">
                            <Button
                                color="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                size="large"
                            >
                                ⭐ Star on GitHub
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <Text className="text-sm">MIT License</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <Text className="text-sm">TypeScript Support</Text>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <Text className="text-sm">Active Community</Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
