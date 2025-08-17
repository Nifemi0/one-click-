import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Activity, CheckCircle, Wifi } from "lucide-react";

export function BackendStatus() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Backend Connection Status
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Test the connection between your frontend and backend to ensure everything is working properly.
          </p>
        </div>
        
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-gray-400">Frontend</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-orange-500"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-gray-400">Backend</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-400 font-medium">Connection Active</span>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
          >
            Test Connection
          </Button>
        </Card>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Last tested: Just now • Status: All systems operational
          </p>
        </div>
      </div>
    </section>
  );
}