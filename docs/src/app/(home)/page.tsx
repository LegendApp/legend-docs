'use client';

import Link from 'next/link';
import { createElement } from 'react';
import classNames from 'classnames';

interface LibrarySectionProps {
  title: string;
  description: string;
  features: string[];
  href: string;
  docsHref: string;
  codeExample: string;
  gradient: string;
  reverse?: boolean;
}

function Header({ children, size, className }: { children: React.ReactNode; size: string; className?: string }) {
  return createElement(
    size,
    {
      className: classNames(
        "text-white font-bold !leading-normal",
        className,
      ),
    },
    children
  );
}

function Text({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={classNames("text-white/80", className)}>
      {children}
    </p>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur border border-white/10 rounded-xl p-6 font-mono text-sm overflow-x-auto">
      <pre className="text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function LibrarySection({ title, description, features, href, docsHref, codeExample, gradient, reverse = false }: LibrarySectionProps) {
  return (
    <div className="relative mb-32">
      {/* Background gradient */}
      <div className={classNames("absolute inset-0 opacity-10 blur-3xl rounded-3xl", gradient)}></div>
      
      <div className={classNames("grid lg:grid-cols-2 gap-12 items-center relative z-10", reverse ? "lg:grid-flow-col-dense" : "")}>
        {/* Content */}
        <div className={reverse ? "lg:col-start-2" : ""}>
          <Header size="h2" className="text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {title}
          </Header>
          
          <Text className="text-xl mb-8 leading-relaxed">
            {description}
          </Text>
          
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <Text className="flex-1">{feature}</Text>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={href} className="group inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors">
              <span className="font-medium">Explore {title}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            <Link href={docsHref} className="group inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors">
              <span className="font-medium">Documentation</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
        
        {/* Code Example */}
        <div className={reverse ? "lg:col-start-1" : ""}>
          <CodeBlock code={codeExample} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const libraries: LibrarySectionProps[] = [
    {
      title: "Legend State",
      description: "Ultra-fast state management with fine-grained reactivity and powerful sync capabilities. Build reactive UIs with minimal boilerplate.",
      features: [
        "Fine-grained reactivity - only re-render what changed",
        "Local-first sync with any backend",
        "TypeScript-first with full type safety",
        "Works with React, React Native, and vanilla JS"
      ],
      href: "/state",
      docsHref: "/state/docs/v3/intro/introduction",
      gradient: "bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600",
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
})`
    },
    {
      title: "Legend List",
      description: "The most powerful virtualized list for React and React Native. Handle millions of items with smooth scrolling and complex layouts.",
      features: [
        "Bidirectional infinite scrolling",
        "Built-in virtualization for massive datasets",
        "Works seamlessly on web and mobile",
        "Perfect for chat interfaces and feeds"
      ],
      href: "/list", 
      docsHref: "/list/docs/v2/intro",
      gradient: "bg-gradient-to-br from-green-600 via-blue-600 to-purple-600",
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
}`
    },
    {
      title: "Legend Motion",
      description: "Smooth, performant animations with a declarative API. Create stunning motion experiences with minimal code.",
      features: [
        "Declarative animation API",
        "High performance with 60fps animations",
        "Works with any CSS property",
        "Timeline-based sequencing"
      ],
      href: "/motion/docs/v1",
      docsHref: "/motion/docs/v1",
      gradient: "bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600",
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
}`
    }
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-[#0d1117]" />
      
      {/* Subtle animated background gradients */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <main className="z-10 flex-grow">
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          {/* Hero Section */}
          <div className="text-center mb-32">
            <Header size="h1" className="text-6xl sm:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-8">
              Legend
            </Header>
            <Text className="text-2xl sm:text-3xl max-w-4xl mx-auto mb-6 leading-relaxed">
              Open-source libraries for building exceptional React applications
            </Text>
            <Text className="text-lg max-w-2xl mx-auto text-white/50">
              Fast, reliable, and developer-friendly tools that scale with your needs
            </Text>
          </div>

          {/* Library Sections */}
          <div>
            {libraries.map((library) => (
              <LibrarySection key={library.title} {...library} />
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-20 border-t border-white/5">
            <Text className="text-white/40 mb-4">
              Ready to build something amazing?
            </Text>
            <Link href="/docs" className="group inline-flex items-center gap-2 text-lg font-medium text-white/90 hover:text-white transition-colors">
              <span>Get Started</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
