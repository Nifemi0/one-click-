import { Button } from "./ui/button";
import { ArrowRight, Zap, Brain, TestTube } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-orange-400 text-sm font-medium">Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Why Choose </span>
            <span className="text-orange-500">One Click?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced security technology wrapped in a simple, intuitive interface
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: One-Click Deployment */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">One-Click Deployment</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Deploy sophisticated security traps with a single click. No coding required.
            </p>
            <Button 
              variant="ghost" 
              className="text-orange-400 hover:text-orange-300 p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 2: AI-Powered Analysis */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Analysis</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Intelligent contract analysis that identifies vulnerabilities before they become threats.
            </p>
            <Button 
              variant="ghost" 
              className="text-orange-400 hover:text-orange-300 p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 3: Testnet Ready */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <TestTube className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Testnet Ready</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Perfect for testing security strategies on Hoodi testnet before mainnet deployment.
            </p>
            <Button 
              variant="ghost" 
              className="text-orange-400 hover:text-orange-300 p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              All systems operational on Hoodi testnet
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
