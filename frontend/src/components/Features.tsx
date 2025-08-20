import { Button } from "./ui/button";
import { ArrowRight, Zap, Brain, TestTube } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center glass border-accent/20 rounded-full px-4 py-2 mb-6">
            <span className="text-accent text-sm font-medium">Features</span>
          </div>
          <h2 className="mb-6">
            <span className="text-foreground">Why Choose </span>
            <span className="gradient-text">One Click?</span>
          </h2>
          <p className="text-xl text-muted container-sm">
            Advanced security technology wrapped in a simple, intuitive interface
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid-responsive mb-16">
          {/* Card 1: Honeypot Deployment */}
          <div className="card card-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-accent/20 to-accent-hover/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Honeypot Deployment</h3>
            <p className="text-muted mb-6 leading-relaxed">
              Set sophisticated traps for malicious actors with advanced honeypot mechanisms.
            </p>
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent-hover p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 2: Real-time Monitoring */}
          <div className="card card-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Real-time Monitoring</h3>
            <p className="text-muted mb-6 leading-relaxed">
              24/7 surveillance of your security infrastructure with instant alerts.
            </p>
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent-hover p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 3: Attack Prevention */}
          <div className="card card-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mb-6">
              <TestTube className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Attack Prevention</h3>
            <p className="text-muted mb-6 leading-relaxed">
              Proactive blocking of common DeFi attacks with intelligent threat detection.
            </p>
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent-hover p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Card 4: Custom Solutions */}
          <div className="card card-hover">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Custom Solutions</h3>
            <p className="text-muted mb-6 leading-relaxed">
              Tailored security for your specific protocol requirements and use cases.
            </p>
            <Button 
              variant="ghost" 
              className="text-accent hover:text-accent-hover p-0 h-auto font-medium group"
            >
              Learn more 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* System Status */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 glass border-green-500/20 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-sm font-medium">
              All systems operational on Hoodi testnet
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
