'use client';

import Link from 'next/link';
import { createElement } from 'react';
import classNames from 'classnames';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { HomePageLayout } from '@/components/HomePageLayout';

interface LibrarySectionProps {
    title: string;
    description: string;
    features: string[];
    href: string;
    docsHref: string;
    codeExample: string;
    reverse?: boolean;
}

function Header({ children, size, className }: { children: React.ReactNode; size: string; className?: string }) {
    return createElement(
        size,
        {
            className: classNames('text-white font-bold !leading-normal', className),
        },
        children,
    );
}

function Text({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={classNames('text-white/80', className)}>{children}</p>;
}

function LibrarySection({
    title,
    description,
    features,
    href,
    docsHref,
    codeExample,
    reverse = false,
}: LibrarySectionProps) {
    return (
        <div className="mb-32">
            <div
                className={classNames(
                    'grid lg:grid-cols-2 gap-16 items-center transition-all duration-700 ease-out',
                    reverse ? 'lg:grid-flow-col-dense' : '',
                )}
            >
                {/* Content */}
                <div className={classNames(reverse ? 'lg:col-start-2' : '')}>
                    <Header size="h2" className="text-4xl lg:text-5xl mb-6 text-white">
                        {title}
                    </Header>

                    <Text className="text-xl mb-8 leading-relaxed">{description}</Text>

                    <ul className="space-y-4 mb-8">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <span className="text-white/40 mt-1 text-sm">•</span>
                                <Text className="flex-1">{feature}</Text>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link
                            href={href}
                            className="group inline-flex items-center gap-2 text-white hover:text-white/80 transition-all duration-300 font-medium relative"
                        >
                            <span className="relative">
                                Explore {title}
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </Link>

                        <Link
                            href={docsHref}
                            className="group inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-all duration-300 relative"
                        >
                            <span className="relative">
                                Documentation
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </Link>
                    </div>
                </div>

                {/* Code Example */}
                <div
                    className={classNames(
                        reverse ? 'lg:col-start-1' : '',
                        'transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20',
                    )}
                >
                    <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <DynamicCodeBlock
                            lang="ts"
                            code={codeExample}
                            options={{
                                themes: {
                                    light: 'github-light',
                                    dark: 'github-dark',
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    const libraries: LibrarySectionProps[] = [
        {
            title: 'Legend State',
            description:
                'Ultra-fast state management with fine-grained reactivity and powerful sync capabilities. Build reactive UIs with minimal boilerplate.',
            features: [
                'Fine-grained reactivity - only re-render what changed',
                'Local-first sync with any backend',
                'TypeScript-first with full type safety',
                'Works with React, React Native, and vanilla JS',
            ],
            href: '/state',
            docsHref: '/state/docs/v3/intro/introduction',
            codeExample: `import { observable } from '@legendapp/state'
import { observer } from '@legendapp/state/react'

const state$ = observable({
  user: { name: 'Sarah', age: 25 },
  todos: []
})

const Profile = observer(() => {
  return (
    <div>
      <h1>Hello {state$.user.name.get()}!</h1>
      <button onClick={() => state$.user.age.set(v => v + 1)}>
        Age: {state$.user.age.get()}
      </button>
    </div>
  )
})`,
        },
        {
            title: 'Legend List',
            description:
                'The most powerful virtualized list for React and React Native. Handle millions of items with smooth scrolling and complex layouts.',
            features: [
                'Bidirectional infinite scrolling',
                'Built-in virtualization for massive datasets',
                'Works seamlessly on web and mobile',
                'Perfect for chat interfaces and feeds',
            ],
            href: '/list',
            docsHref: '/list/docs/v2/intro',
            reverse: true,
            codeExample: `import { LegendList } from '@legendapp/list'

function ChatInterface() {
  return (
    <LegendList
      data={messages}
      estimatedItemSize={60}
      maintainVisibleContentPosition
      initialScrollToEnd
    >
      {({ item, index }) => (
        <Message
          key={item.id}
          message={item}
          isOwn={item.userId === currentUser.id}
        />
      )}
    </LegendList>
  )
}`,
        },
        {
            title: 'Legend Motion',
            description:
                'Smooth, performant animations with a declarative API. Create stunning motion experiences with minimal code.',
            features: [
                'Declarative animation API',
                'High performance with 60fps animations',
                'Works with any CSS property',
                'Timeline-based sequencing',
            ],
            href: '/motion/docs/v1',
            docsHref: '/motion/docs/v1',
            codeExample: `import { Motion } from '@legendapp/motion'

function AnimatedCard() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Motion
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <div className="card">
        Beautiful animations made simple
      </div>
    </Motion>
  )
}`,
        },
    ];

    return (
        <HomePageLayout>
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col text-white">
                {/* Background */}
                <div className="fixed inset-0 bg-[#0d1117]">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10 animate-pulse"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
                </div>

                <main className="z-10 flex-grow">
                    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
                        {/* Hero Section */}
                        <div className="text-center mb-40 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 blur-3xl opacity-50"></div>
                            <div className="relative z-10">
                                <Header
                                    size="h1"
                                    className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 animate-fade-in"
                                >
                                    Legend
                                </Header>
                                <Text className="text-2xl sm:text-3xl max-w-4xl mx-auto mb-6 leading-relaxed text-white/90">
                                    Open-source libraries for building exceptional React applications
                                </Text>
                                <Text className="text-lg max-w-2xl mx-auto text-white/40">
                                    Fast, reliable, and developer-friendly tools that scale with your needs
                                </Text>
                            </div>
                        </div>

                        {/* Library Sections */}
                        <div>
                            {libraries.map((library) => (
                                <LibrarySection key={library.title} {...library} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </HomePageLayout>
    );
}
