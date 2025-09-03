// Feature Flags System
// This controls the visibility of hidden/premium features

export const featureFlags = {
  // Core features
  basicTrapDeployment: true,
  marketplace: true,
  oneclickRegistry: true,
  
  // Premium features
  enhancedAITrapDeployment: true, // Enabled for password-protected testing
  premiumFeatures: true,
  enterpriseFeatures: false,
  
  // Development features
  betaFeatures: false,
  experimentalFeatures: false,
  
  // UI features
  darkMode: true,
  advancedFilters: true,
  realTimeUpdates: true,
  
  // Analytics and monitoring
  analytics: true,
  performanceMonitoring: true,
  userTracking: false,
  
  // Security features
  twoFactorAuth: false,
  advancedSecurity: true,
  auditLogging: true,
  
  // Integration features
  walletConnect: true,
  multiChainSupport: true,
  apiAccess: true,
  
  // Testing features
  testMode: false,
  debugMode: false,
  mockData: false
};

// Helper functions to check feature availability
export const isFeatureEnabled = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature] || false;
};

export const canAccessPremiumFeatures = (): boolean => {
  return featureFlags.premiumFeatures;
};

export const canAccessEnterpriseFeatures = (): boolean => {
  return featureFlags.enterpriseFeatures;
};

export const canAccessEnhancedAI = (): boolean => {
  return featureFlags.enhancedAITrapDeployment;
};

// Environment-specific feature flags
export const getEnvironmentFeatures = (environment: 'development' | 'staging' | 'production' | 'test') => {
  switch (environment) {
    case 'development':
      return {
        ...featureFlags,
        enhancedAITrapDeployment: true, // Show in development
        debugMode: true,
        testMode: true
      };
    case 'staging':
      return {
        ...featureFlags,
        enhancedAITrapDeployment: true, // Show in staging
        debugMode: false,
        testMode: true
      };
    case 'production':
      return {
        ...featureFlags,
        enhancedAITrapDeployment: true, // Show in production (password protected)
        debugMode: false,
        testMode: false
      };
    case 'test':
      return {
        ...featureFlags,
        enhancedAITrapDeployment: true, // Show in test
        debugMode: true,
        testMode: true
      };
    default:
      return featureFlags;
  }
};

// User role-based feature access
export const getUserFeatureAccess = (userRole: string, isPremium: boolean) => {
  const baseFeatures = {
    basicTrapDeployment: true,
    marketplace: true,
    oneclickRegistry: true,
    darkMode: true,
    walletConnect: true
  };

  const premiumFeatures = {
    ...baseFeatures,
    enhancedAITrapDeployment: isPremium && canAccessEnhancedAI(),
    premiumFeatures: isPremium,
    advancedFilters: true,
    realTimeUpdates: true,
    analytics: true,
    performanceMonitoring: true
  };

  const enterpriseFeatures = {
    ...premiumFeatures,
    enterpriseFeatures: true,
    advancedSecurity: true,
    auditLogging: true,
    multiChainSupport: true,
    apiAccess: true
  };

  switch (userRole) {
    case 'enterprise':
      return enterpriseFeatures;
    case 'premium':
      return premiumFeatures;
    default:
      return baseFeatures;
  }
};

// Subscription-based feature access
export const getSubscriptionFeatures = (subscriptionTier: string): string[] => {
  const baseFeatures = ['Basic Trap Creation', 'Standard Monitoring'];
  
  if (subscriptionTier === 'premium') {
    return [...baseFeatures, 'Advanced Traps', 'Enhanced Monitoring', 'Priority Support'];
  }
  
  if (subscriptionTier === 'enterprise') {
    return [
      ...baseFeatures,
      'Advanced Traps',
      'Enhanced Monitoring',
      'Priority Support',
      'Custom Features',
      'White-label Solutions',
      'Dedicated Support'
    ];
  }
  
  return baseFeatures;
};

// Feature availability by subscription
export const getFeatureAvailability = (subscriptionTier: string): Record<string, boolean> => {
  const isPremium = ['premium', 'enterprise'].includes(subscriptionTier);
  const isEnterprise = subscriptionTier === 'enterprise';
  
  return {
    basicTraps: true,
    advancedTraps: isPremium,
    enhancedAITrapDeployment: isPremium && canAccessEnhancedAI(),
    premiumMonitoring: isPremium,
    enterpriseFeatures: isEnterprise,
    betaFeatures: isPremium && featureFlags.betaFeatures,
  };
};

// Export default flags for immediate use
export default featureFlags;