export function Donation() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-white">Support Development</h2>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Help us continue building One Click on Hoodi testnet. Your donations support development, 
          testing, and future mainnet features.
        </p>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Donate</h3>
            <p className="text-gray-400 mb-6">Send any amount to support One Click development</p>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
              <p className="text-sm text-gray-400 mb-3 font-medium">Wallet Address:</p>
              <p className="text-sm font-mono text-orange-400 break-all">0xa3B983c22c10Bb64bd812ACd9Eb15B13856aF3b7</p>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300">
               Copy Address
            </button>
          </div>

          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">Connect With Us</h3>
            <p className="text-gray-400 mb-6">Follow us for updates and community news</p>
            <a 
              href="https://x.com/Love_Light_11" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-center"
            >
               Follow on X (Twitter)
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300">
             Get Started Now
          </button>
          <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200">
             Read Documentation
          </button>
        </div>
      </div>
    </section>
  );
}
