import React, { useState } from 'react';
import { canAccessEnhancedAI } from '../utils/featureFlags';

interface HiddenNavigationProps {
  isVisible?: boolean;
}

const HiddenNavigation: React.FC<HiddenNavigationProps> = ({ isVisible = false }) => {
  const [showHiddenMenu, setShowHiddenMenu] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  // Hide component if not visible (for hidden feature)
  if (!isVisible) {
    return null;
  }

  const handleSecretCode = () => {
    // Easter egg: Konami code or secret phrase
    if (secretCode.toLowerCase().includes('drosera') || secretCode.toLowerCase().includes('enhanced')) {
      setShowHiddenMenu(true);
      setAttempts(0);
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        alert('🤫 This feature is not yet available. Stay tuned for updates!');
        setSecretCode('');
        setAttempts(0);
      }
    }
  };

  const handleKonamiCode = (e: React.KeyboardEvent) => {
    // Konami code: ↑↑↓↓←→←→BA
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    const handleKey = (event: KeyboardEvent) => {
      let currentSequence: string[] = [];
      
      // Get existing sequence from storage or start fresh
      const existingSequence = sessionStorage.getItem('konamiSequence');
      if (existingSequence) {
        currentSequence = JSON.parse(existingSequence);
      }
      
      currentSequence.push(event.code);
      
      if (currentSequence.length > konamiSequence.length) {
        currentSequence.shift();
      }
      
      // Store updated sequence
      sessionStorage.setItem('konamiSequence', JSON.stringify(currentSequence));
      
      if (currentSequence.join(',') === konamiSequence.join(',')) {
        setShowHiddenMenu(true);
        document.removeEventListener('keydown', handleKey);
        sessionStorage.removeItem('konamiSequence'); // Clear after success
      }
    };
    
    document.addEventListener('keydown', handleKey);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Hidden Feature Indicator */}
      <div className="relative">
        {/* Secret Button (Hidden) */}
        <button
          onKeyDown={handleKonamiCode}
          className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-600 hover:border-orange-500/50 transition-all duration-300 opacity-50 hover:opacity-100"
          title="Hidden Feature"
          onClick={() => setShowHiddenMenu(!showHiddenMenu)}
        >
          <span className="text-orange-500 text-lg">🎭</span>
        </button>
        
        {/* Hidden Menu */}
        {showHiddenMenu && (
          <div className="absolute bottom-16 right-0 bg-gray-800 border border-orange-500/30 rounded-lg p-4 shadow-2xl min-w-64">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-orange-500">🚀 Hidden Features</h3>
              <p className="text-sm text-gray-400">Premium features coming soon!</p>
            </div>
            
            {/* Secret Code Input */}
            <div className="mb-4">
              <input
                type="text"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter secret code..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSecretCode()}
              />
              <button
                onClick={handleSecretCode}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-sm py-1 px-3 rounded transition-colors"
              >
                🔓 Unlock
              </button>
            </div>
            
            {/* Feature Preview */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Enhanced AI Deployment</span>
                <span className="text-orange-400">🔒</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">TOML Configuration</span>
                <span className="text-orange-400">🔒</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">iTrap Files</span>
                <span className="text-orange-400">🔒</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Enterprise Security</span>
                <span className="text-orange-400">🔒</span>
              </div>
            </div>
            
            {/* Coming Soon Message */}
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-xs text-orange-400 text-center">
                🎉 These features will be revealed in a future update!
              </p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowHiddenMenu(false)}
              className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenNavigation;