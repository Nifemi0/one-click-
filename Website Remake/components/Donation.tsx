import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Copy, Check, Heart } from "lucide-react";

export function Donation() {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Support Development
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Help us continue building One Click on Hoodi testnet. Your donations support development, testing, and future mainnet features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Donation Box */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Donate</h3>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Send any amount to support One Click development
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Wallet Address</label>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <code className="text-orange-400 text-sm break-all">
                    {walletAddress}
                  </code>
                </div>
              </div>
              
              <Button 
                onClick={copyAddress}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    💝 Copy Address
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Social Media Box */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-lg">🐦</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Connect With Us</h3>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Follow us for updates, news, and community updates
            </p>
            
            <div className="space-y-4">
              <Button 
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
              >
                <a 
                  href="https://x.com/Love_Light_11" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  🐦 Follow on X (Twitter)
                </a>
              </Button>
              
              <p className="text-gray-500 text-sm text-center">
                More social platforms coming soon!
              </p>
            </div>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-orange-500/25 transition-all duration-200 text-lg px-8 py-6"
          >
            🚀 Get Started Now
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 text-lg px-8 py-6"
          >
            📖 Read Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}