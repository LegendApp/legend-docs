import { Header } from './Header';
import { Text } from './Text';
import { Button } from './Button';

export function TalksSection() {
  const talks = [
    {
      title: 'App.js Conference 2024',
      description: 'Deep dive into Legend List performance optimizations and real-world use cases',
      type: 'Conference Talk',
      duration: '25 min',
      thumbnail: '🎬',
      url: 'https://www.youtube.com/watch?v=appjs2024', // Replace with actual URL
      platform: 'YouTube'
    },
    {
      title: 'React Universe Conference',
      description: 'Building AI chat interfaces with bidirectional infinite scrolling',
      type: 'Technical Talk',
      duration: '30 min',
      thumbnail: '🚀',
      url: 'https://www.youtube.com/watch?v=reactuniverse', // Replace with actual URL
      platform: 'YouTube'
    },
    {
      title: 'React Native Show Podcast',
      description: 'Discussion on the future of list virtualization and mobile performance',
      type: 'Podcast Episode',
      duration: '45 min',
      thumbnail: '🎙️',
      url: 'https://www.reactnativeshow.com/legend-list', // Replace with actual URL
      platform: 'Podcast'
    },
    {
      title: 'Developer Interview',
      description: 'Behind the scenes of Legend List development and architecture decisions',
      type: 'Interview',
      duration: '20 min',
      thumbnail: '💬',
      url: 'https://www.youtube.com/watch?v=interview', // Replace with actual URL
      platform: 'YouTube'
    }
  ];

  return (
    <div className="mt-section px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Header size="h2" className="text-4xl sm:text-5xl mb-6">
            Talks & Media
          </Header>
          <Text className="text-xl max-w-3xl mx-auto">
            Learn from the creators and community. Watch talks, listen to podcasts, 
            and discover how teams are using Legend List in production
          </Text>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {talks.map((talk, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors">
              {/* Thumbnail/Preview */}
              <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center border-b border-white/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">{talk.thumbnail}</div>
                  <div className="inline-flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <Text className="text-xs">{talk.duration}</Text>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                    <Text className="text-xs text-blue-400">{talk.type}</Text>
                  </div>
                  <div className="px-2 py-1 bg-gray-600/20 border border-gray-500/30 rounded-full">
                    <Text className="text-xs text-gray-400">{talk.platform}</Text>
                  </div>
                </div>

                <Header size="h4" className="text-xl mb-3">{talk.title}</Header>
                <Text className="text-white/70 mb-6">{talk.description}</Text>

                <Button 
                  href={talk.url}
                  color="bg-red-600 hover:bg-red-700 text-white"
                  className="w-full justify-center"
                >
                  {talk.platform === 'Podcast' ? '🎧 Listen Now' : '▶️ Watch Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional resources */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-8">
            <Header size="h3" className="text-2xl mb-4">Want to Share Your Story?</Header>
            <Text className="text-white/70 mb-6 max-w-2xl mx-auto">
              Using Legend List in production? We'd love to feature your use case, 
              performance improvements, or technical insights with the community.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                href="https://github.com/LegendApp/legend-list/discussions"
                color="bg-blue-600 hover:bg-blue-700 text-white"
              >
                📝 Share Your Story
              </Button>
              
              <Button 
                href="https://twitter.com/legendappteam"
                color="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                🐦 Follow Updates
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter/Updates */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-2xl mb-3">📺</div>
            <Header size="h4" className="text-lg mb-2">YouTube Channel</Header>
            <Text className="text-sm text-white/70">
              Subscribe for tutorials, performance tips, and new features
            </Text>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-2xl mb-3">💬</div>
            <Header size="h4" className="text-lg mb-2">Discord Community</Header>
            <Text className="text-sm text-white/70">
              Join developers discussing implementations and best practices
            </Text>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-2xl mb-3">📧</div>
            <Header size="h4" className="text-lg mb-2">Newsletter</Header>
            <Text className="text-sm text-white/70">
              Get updates on new releases, performance improvements, and tips
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}