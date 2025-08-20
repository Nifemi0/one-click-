import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const handleDeployTrap = () => {
    window.location.href = '/deploy';
  };

  const handleViewTemplates = () => {
    window.location.href = '/marketplace';
  };

  return (
    <section className="relative min-h-screen pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-600/5"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      {/* Floating Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
          transform: "rotate(-12deg) scale(1.5)"
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium">
              Currently supporting Hoodi testnet for testing and development
            </span>
          </div>

          {/* Enhanced Title with Animation */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="block">Secure Your DeFi with</span>
            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              One Click
            </span>
          </h1>
          
          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Deploy sophisticated security traps on{" "}
            <span className="text-orange-400 font-semibold">Hoodi testnet</span>{" "}
            with AI-powered analysis. Protect your assets with enterprise-grade security made simple.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              onClick={handleDeployTrap}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 text-lg px-8 py-6 group hover:scale-105 transform"
            >
               Deploy Security Trap
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewTemplates}
              className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-gray-500 transition-all duration-300 text-lg px-8 py-6 group backdrop-blur-sm hover:scale-105 transform"
            >
               View Templates
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* New Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-sm text-gray-400 mt-1">Success Rate</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-sm text-gray-400 mt-1">Monitoring</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="text-sm text-gray-400 mt-1">Testnet Live</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                AI
              </div>
              <div className="text-sm text-gray-400 mt-1">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
