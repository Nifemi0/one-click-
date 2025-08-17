import { Card } from "./ui/card";
import { Zap, Brain, TestTube, Monitor, Store, Users, ArrowRight } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "One-Click Deployment",
      description: "Deploy sophisticated security traps with a single click. No coding required.",
      gradient: "from-blue-500 to-cyan-500",
      bgPattern: "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Intelligent contract analysis that identifies vulnerabilities before they become threats.",
      gradient: "from-purple-500 to-pink-500",
      bgPattern: "radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)"
    },
    {
      icon: TestTube,
      title: "Testnet Ready",
      description: "Perfect for testing security strategies on Hoodi testnet before mainnet deployment.",
      gradient: "from-green-500 to-emerald-500",
      bgPattern: "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)"
    },
    {
      icon: Monitor,
      title: "Real-Time Monitoring",
      description: "24/7 monitoring with instant alerts when threats are detected.",
      gradient: "from-orange-500 to-red-500",
      bgPattern: "radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)"
    },
    {
      icon: Store,
      title: "Template Marketplace",
      description: "Browse and deploy from curated, audited security trap templates.",
      gradient: "from-indigo-500 to-purple-500",
      bgPattern: "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Contribute templates, share strategies, and earn rewards.",
      gradient: "from-teal-500 to-cyan-500",
      bgPattern: "radial-gradient(circle at 50% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden" id="features">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <span className="text-orange-400 text-sm font-medium">Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              One Click?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Advanced security technology wrapped in a simple, intuitive interface
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-orange-500/30 transition-all duration-500 p-8 group hover:scale-[1.02] transform backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: feature.bgPattern }}
                ></div>
                
                {/* Glassmorphism Border Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-orange-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Learn More Arrow */}
                  <div className="flex items-center text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-medium mr-2">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Ready to secure your DeFi assets?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 hover:scale-105 transform">
              🚀 Get Started Now
            </button>
            <button className="border border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-500 px-8 py-3 rounded-lg font-medium backdrop-blur-sm transition-all duration-200">
              📖 Read Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}