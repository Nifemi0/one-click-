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
    <section className="section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="mb-6">
            Support Security Research
          </h2>
          <p className="text-xl text-muted container-sm">
            Help us build better DeFi security tools and continue advancing blockchain security research.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 container-sm">
          {/* Donate Card */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Donate</h3>
            </div>
            <p className="text-muted mb-6">
              Send any amount to support One Click development.
            </p>
            
            <div className="mb-6">
              <label className="block text-muted-foreground text-sm mb-2">Wallet Address</label>
              <div className="bg-input rounded-lg p-3 border border-border">
                <code className="text-accent font-mono text-sm break-all">
                  {walletAddress}
                </code>
              </div>
            </div>
            
            <Button 
              onClick={copyToClipboard}
              className="btn btn-primary w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
          </div>

          {/* Connect With Us Card */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Connect With Us</h3>
            </div>
            <p className="text-muted mb-6">
              Follow us for updates, news, and community updates.
            </p>
            
            <Button 
              className="btn btn-primary w-full mb-4"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Follow on X (Twitter)
            </Button>
            
            <p className="text-muted-foreground text-sm text-center">
              More social platforms coming soon!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
