"use client";

import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { Header } from "../../components/Header";

export default function DeployPage() {
  useEffect(() => {
    // Automatically redirect to marketplace after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/marketplace';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="text-center max-w-2xl mx-auto px-4">
          {/* Shield Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="w-12 h-12 text-white" />
          </div>
          
          {/* Main Message */}
          <h1 className="text-4xl font-bold text-white mb-6">
            Redirecting to Marketplace
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We've moved all our security trap templates to the marketplace page for a better experience. 
            You'll find the same clean card layout and all the templates there.
          </p>
          
          {/* Redirect Button */}
          <Button
            onClick={() => window.location.href = '/marketplace'}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg"
          >
            Go to Marketplace Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {/* Auto-redirect notice */}
          <p className="text-sm text-gray-400 mt-6">
            You'll be redirected automatically in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
