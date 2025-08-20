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
    <section id="hero" className="relative min-h-screen pt-16 section overflow-hidden flex items-center">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-hover/5"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-hover/10 rounded-full blur-3xl animate-float-delay-1"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float-delay-2"></div>
      
      {/* Floating Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
          transform: "rotate(-12deg) scale(1.5)"
        }}></div>
      </div>
      
      <div className="container relative z-10">
        <div className="container-sm">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 glass border-accent/20 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-accent text-sm font-medium">
              Deploy Security Traps on Hoodi Testnet
            </span>
          </div>

          {/* Enhanced Title with Animation */}
          <h1 className="mb-8 leading-tight">
            <span className="block">Deploy Security Traps on</span>
            <span className="block gradient-text animate-pulse">
              Hoodi Testnet
            </span>
          </h1>
          
          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl text-muted mb-12 leading-relaxed container-sm">
            Protect your DeFi protocols with battle-tested security mechanisms.{" "}
            <span className="text-accent font-semibold">One Click DeFi</span>{" "}
            provides enterprise-grade security made simple.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              onClick={handleDeployTrap}
              className="btn btn-primary btn-xl group"
            >
               Deploy Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewTemplates}
              className="btn btn-outline btn-xl group"
            >
               View Marketplace
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* New Stats Preview */}
          <div className="grid-responsive container-sm">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-sm text-muted mt-1">Success Rate</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-sm text-muted mt-1">Monitoring</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="text-sm text-muted mt-1">Testnet Live</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                AI
              </div>
              <div className="text-sm text-muted mt-1">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
