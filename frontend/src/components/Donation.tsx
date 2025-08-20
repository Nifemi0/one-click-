import { Button } from "./ui/button";
import { Heart, Copy, Twitter } from "lucide-react";

export function Donation() {
  const walletAddress = "0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      // You could add a toast notification here
      alert('Wallet address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Support Development
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Help us continue building One Click on Hoodi testnet. Your donations support development, testing, and future mainnet features.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Donate Card */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border-2 border-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white">Donate</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Send any amount to support One Click development.
            </p>
            
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Wallet Address</label>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <code className="text-orange-400 font-mono text-sm break-all">
                  {walletAddress}
                </code>
              </div>
            </div>
            
            <Button 
              onClick={copyToClipboard}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
          </div>

          {/* Connect With Us Card */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Connect With Us</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Follow us for updates, news, and community updates.
            </p>
            
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 mb-4"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Follow on X (Twitter)
            </Button>
            
            <p className="text-gray-400 text-sm text-center">
              More social platforms coming soon!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
