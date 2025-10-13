import { Header } from './Header';
import { Text } from './Text';

export function FeaturesSection() {
  const features = [
    {
      icon: '♾️',
      title: 'Bidirectional Infinite Scrolling',
      description: 'Load content in both directions - perfect for chat histories, timelines, and feeds'
    },
    {
      icon: '📱',
      title: 'Mobile & Web Optimized',
      description: 'Consistent performance across React and React Native with platform-specific optimizations'
    },
    {
      icon: '🔄',
      title: 'Dynamic Item Heights',
      description: 'Automatically handles variable item sizes without measuring or configuration'
    },
    {
      icon: '🧠',
      title: 'Smart Memory Management',
      description: 'Intelligent item recycling keeps memory usage low even with millions of items'
    },
    {
      icon: '⚡',
      title: 'Zero Configuration',
      description: 'Works out of the box with sensible defaults, customize only when needed'
    },
    {
      icon: '🎨',
      title: 'Fully Customizable',
      description: 'Style and animate list items however you want with complete control'
    },
    {
      icon: '🔍',
      title: 'Search & Filter',
      description: 'Built-in support for real-time filtering and search with maintained scroll position'
    },
    {
      icon: '🎯',
      title: 'Precise Scrolling',
      description: 'Programmatic scrolling to specific items or positions with smooth animations'
    },
    {
      icon: '📊',
      title: 'Analytics Ready',
      description: 'Track scroll position, visible items, and user interactions out of the box'
    }
  ];

  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Powerful Features
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            Everything you need to build complex, high-performance list experiences
          </Text>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <Header size="h4" className="text-xl mb-3">{feature.title}</Header>
              <Text className="text-white/70">
                {feature.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}