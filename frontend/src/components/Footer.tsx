import { Rocket, Book } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Get Started Now
            </button>
            <button className="border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <Book className="w-5 h-5" />
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="section-sm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-accent to-accent-hover rounded flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">1</span>
                </div>
                <span className="text-foreground font-semibold">One Click DeFi</span>
              </div>
              <p className="text-muted mb-4 leading-relaxed">
                Advanced DeFi security platform for protecting your protocols.
              </p>
              <p className="text-muted-foreground text-sm">
                © 2024 One Click DeFi. All rights reserved.
              </p>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-muted hover:text-foreground transition-colors">About</a></li>
                <li><a href="#team" className="text-muted hover:text-foreground transition-colors">Team</a></li>
                <li><a href="#careers" className="text-muted hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#press" className="text-muted hover:text-foreground transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Security Column */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Security</h4>
              <ul className="space-y-2">
                <li><a href="#documentation" className="text-muted hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#best-practices" className="text-muted hover:text-foreground transition-colors">Best Practices</a></li>
                <li><a href="#audits" className="text-muted hover:text-foreground transition-colors">Audits</a></li>
                <li><a href="#bug-bounty" className="text-muted hover:text-foreground transition-colors">Bug Bounty</a></li>
              </ul>
            </div>

            {/* Community Column */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#discord" className="text-muted hover:text-foreground transition-colors">Discord</a></li>
                <li><a href="#twitter" className="text-muted hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="https://github.com/Nifemi0/one-click-" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="#blog" className="text-muted hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

                  {/* Newsletter Signup */}
        <div className="border-t border-border mt-12 pt-8 mb-8">
          <div className="text-center">
            <h4 className="text-foreground font-semibold mb-4">Stay Updated</h4>
            <p className="text-muted mb-6">Get the latest security insights and platform updates</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus-ring"
              />
              <button className="btn btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Links */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              One Click DeFi - Advanced DeFi Security Platform
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#disclaimer" className="text-muted-foreground hover:text-foreground transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
        </div>
      </section>
    </footer>
  );
}
