// Feature Flags System
// This controls the visibility of hidden/premium features

export interface FeatureFlags {
  enhancedAITrapDeployment: boolean;
  premiumFeatures: boolean;
  enterpriseFeatures: boolean;
  betaFeatures: boolean;
}

// Default feature flags (all hidden for initial launch)
const defaultFeatureFlags: FeatureFlags = {
  enhancedAITrapDeployment: false, // Hidden premium feature
  premiumFeatures: false, // Basic premium features
  enterpriseFeatures: false, // Enterprise features
  betaFeatures: false, // Beta testing features
};

type Environment = 'development' | 'production' | 'staging' | 'test';

// Environment-based feature flags
const getEnvironmentFlags = (): Partial<FeatureFlags> => {
  const env = (process.env.NODE_ENV || 'development') as Environment;
  
  if (env === 'development') {
    return {
      enhancedAITrapDeployment: true, // Show in development
      premiumFeatures: true,
      enterpriseFeatures: true,
      betaFeatures: true,
    };
  }
  
  if (env === 'staging') {
    return {
      enhancedAITrapDeployment: false, // Hidden in staging
      premiumFeatures: true,
      enterpriseFeatures: false,
      betaFeatures: true,
    };
  }
  
  if (env === 'test') {
    return {
      enhancedAITrapDeployment: true, // Show in test
      premiumFeatures: true,
      enterpriseFeatures: true,
      betaFeatures: true,
    };
  }
  
  // Production - all hidden
  return {};
};

// Runtime feature flags (can be controlled via API)
let runtimeFeatureFlags: Partial<FeatureFlags> = {};

// Initialize feature flags
export const initializeFeatureFlags = async (): Promise<void> => {
  try {
    // In the future, this could fetch from an API
    // const response = await fetch('/api/feature-flags');
    // runtimeFeatureFlags = await response.json();
    
    // For now, use environment flags
    runtimeFeatureFlags = getEnvironmentFlags();
    
    console.log('🚀 Feature flags initialized:', getFeatureFlags());
  } catch (error) {
    console.warn('Failed to initialize feature flags, using defaults:', error);
  }
};

// Get current feature flags
export const getFeatureFlags = (): FeatureFlags => {
  return {
    ...defaultFeatureFlags,
    ...getEnvironmentFlags(),
    ...runtimeFeatureFlags,
  };
};

// Check if a specific feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[feature] || false;
};

// Update runtime feature flags (for admin use)
export const updateFeatureFlags = (updates: Partial<FeatureFlags>): void => {
  runtimeFeatureFlags = {
    ...runtimeFeatureFlags,
    ...updates,
  };
  
  console.log('🔧 Feature flags updated:', getFeatureFlags());
};

// Feature-specific helper functions
export const canAccessEnhancedAI = (): boolean => {
  return isFeatureEnabled('enhancedAITrapDeployment');
};

export const canAccessPremiumFeatures = (): boolean => {
  return isFeatureEnabled('premiumFeatures');
};

export const canAccessEnterpriseFeatures = (): boolean => {
  return isFeatureEnabled('enterpriseFeatures');
};

export const canAccessBetaFeatures = (): boolean => {
  return isFeatureEnabled('betaFeatures');
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
    betaFeatures: isPremium && canAccessBetaFeatures(),
  };
};

// Export default flags for immediate use
export default getFeatureFlags();