import { Card } from "./ui/card";
import { CheckCircle, Activity, Clock, TestTube } from "lucide-react";

export function Stats() {
  const stats = [
    {
      icon: TestTube,
      value: "1",
      label: "Testnet",
      description: "Currently live on Hoodi testnet",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: CheckCircle,
      value: "99.9%",
      label: "Success Rate",
      description: "Proven reliability record",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Monitoring",
      description: "Round-the-clock protection",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Activity,
      value: "Test",
      label: "Environment",
      description: "Safe testing playground",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <span className="text-orange-400 text-sm font-medium">Live Stats</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Hoodi Testnet
            </span>{" "}
            Security
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Secure your testnet assets while we prepare for mainnet
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 p-6 text-center group hover:scale-105 transform backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg`}></div>
                
                <div className="relative z-10">
                  <div className="mb-4 flex justify-center">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-100 transition-colors duration-300">
                    {stat.label}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {stat.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">
              All systems operational on Hoodi testnet
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}