import { Shield, Zap, Brain, Eye, Store, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "One-Click Deployment",
      description: "Deploy sophisticated security traps with a single click. No coding required."
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Intelligent contract analysis that identifies vulnerabilities before they become threats."
    },
    {
      icon: Zap,
      title: "Testnet Ready",
      description: "Perfect for testing security strategies on Hoodi testnet before mainnet deployment."
    },
    {
      icon: Eye,
      title: "Real-Time Monitoring",
      description: "24/7 monitoring with instant alerts when threats are detected."
    },
    {
      icon: Store,
      title: "Template Marketplace",
      description: "Browse and deploy from curated, audited security trap templates."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Contribute templates, share strategies, and earn rewards."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-white">Why Choose One Click?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Advanced security technology wrapped in a simple, intuitive interface
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 h-full hover:border-orange-500/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 transform">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-orange-500/30 group-hover:to-red-600/30 transition-colors">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
