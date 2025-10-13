import { Header } from './Header';
import { Text } from './Text';

export function PerformanceSection() {
  const benchmarks = [
    { library: 'Legend List', time: '0.8ms', color: 'bg-green-500' },
    { library: 'React Window', time: '4.2ms', color: 'bg-yellow-500' },
    { library: 'React Virtualized', time: '7.1ms', color: 'bg-orange-500' },
    { library: 'Native ScrollView', time: '12.3ms', color: 'bg-red-500' },
  ];

  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Blazing Fast Performance
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            Optimized for both React and React Native, Legend List delivers unmatched performance 
            for lists of any size
          </Text>
        </div>

        {/* Performance chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <Header size="h3" className="text-2xl mb-8 text-center">
            Render Time Comparison (10,000 items)
          </Header>
          
          <div className="space-y-4">
            {benchmarks.map((bench, index) => (
              <div key={bench.library} className="flex items-center">
                <div className="w-32 text-right pr-4">
                  <Text className="text-white font-semibold">{bench.library}</Text>
                </div>
                <div className="flex-1 flex items-center">
                  <div 
                    className={`h-8 ${bench.color} rounded-r-md flex items-center justify-end pr-4 text-white font-bold`}
                    style={{ 
                      width: `${index === 0 ? 8 : index === 1 ? 42 : index === 2 ? 71 : 100}%`,
                      minWidth: '60px'
                    }}
                  >
                    {bench.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-4xl mb-4">⚡</div>
            <Header size="h4" className="text-xl mb-3">Lightning Fast</Header>
            <Text className="text-white/70">
              Optimized rendering algorithms ensure smooth scrolling even with millions of items
            </Text>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-4xl mb-4">🧠</div>
            <Header size="h4" className="text-xl mb-3">Smart Virtualization</Header>
            <Text className="text-white/70">
              Intelligent item recycling and memory management for optimal performance
            </Text>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-4xl mb-4">📏</div>
            <Header size="h4" className="text-xl mb-3">Dynamic Sizing</Header>
            <Text className="text-white/70">
              Automatically handles variable item heights without performance penalties
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}