/**
 * Debug configuration for the project
 */

module.exports = {
  // Development debugging options
  development: {
    // Enable detailed logging
    verbose: true,
    // Enable source maps
    sourceMaps: true,
    // Enable performance monitoring
    performance: true,
    // Enable error tracking
    errorTracking: true,
    // Enable state logging
    stateLogging: true,
    // Enable prop logging
    propLogging: true,
    // Enable API call logging
    apiLogging: true,
    // Enable Web3 debugging
    web3Debug: true,
  },

  // Production debugging options (minimal)
  production: {
    verbose: false,
    sourceMaps: false,
    performance: false,
    errorTracking: true,
    stateLogging: false,
    propLogging: false,
    apiLogging: false,
    web3Debug: false,
  },

  // Testing debugging options
  testing: {
    verbose: true,
    sourceMaps: true,
    performance: true,
    errorTracking: true,
    stateLogging: true,
    propLogging: true,
    apiLogging: true,
    web3Debug: true,
  },

  // Get current environment config
  getCurrentConfig: () => {
    const env = process.env.NODE_ENV || 'development';
    return module.exports[env] || module.exports.development;
  },

  // Check if debugging is enabled for a specific feature
  isEnabled: (feature) => {
    const config = module.exports.getCurrentConfig();
    return config[feature] || false;
  },

  // Get debugging level
  getLevel: () => {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') return 'error';
    if (env === 'testing') return 'debug';
    return 'debug';
  }
};
