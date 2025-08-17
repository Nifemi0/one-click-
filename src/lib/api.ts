// API client for backend communication

import { 
  TrapTemplate, 
  DeployedTrap, 
  Alert, 
  ContractAnalysis, 
  TrapDeploymentParams,
  DeploymentResult,
  User,
  UserPreferences 
} from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_ENDPOINTS.BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadAuthToken();
  }

  private loadAuthToken(): void {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('drosera_auth_token');
    }
  }

  private setAuthToken(token: string): void {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('drosera_auth_token', token);
    }
  }

  private clearAuthToken(): void {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('drosera_auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData.code
        );
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 0);
      }
      
      throw new ApiError('An unexpected error occurred.', 500);
    }
  }

  // Authentication endpoints
  async connectWallet(address: string, signature: string, message: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>(API_ENDPOINTS.AUTH.CONNECT, {
      method: 'POST',
      body: JSON.stringify({ address, signature, message }),
    });

    this.setAuthToken(response.token);
    return response;
  }

  async getUserProfile(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  async updateUserSettings(preferences: Partial<UserPreferences>): Promise<User> {
    return this.request<User>(API_ENDPOINTS.AUTH.SETTINGS, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Trap management endpoints
  async getTrapTemplates(): Promise<TrapTemplate[]> {
    return this.request<TrapTemplate[]>(API_ENDPOINTS.TRAPS.TEMPLATES);
  }

  async deployTrap(params: TrapDeploymentParams): Promise<DeploymentResult> {
    return this.request<DeploymentResult>(API_ENDPOINTS.TRAPS.DEPLOY, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getUserTraps(address: string): Promise<DeployedTrap[]> {
    return this.request<DeployedTrap[]>(`${API_ENDPOINTS.TRAPS.USER}/${address}`);
  }

  async configureTrap(trapId: string, configuration: any): Promise<DeployedTrap> {
    return this.request<DeployedTrap>(`${API_ENDPOINTS.TRAPS.CONFIGURE}/${trapId}`, {
      method: 'PUT',
      body: JSON.stringify(configuration),
    });
  }

  async deleteTrap(trapId: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.TRAPS.DELETE}/${trapId}`, {
      method: 'DELETE',
    });
  }

  // Contract analysis endpoints
  async analyzeContract(contractAddress: string, chainId: number): Promise<ContractAnalysis> {
    return this.request<ContractAnalysis>(API_ENDPOINTS.ANALYSIS.CONTRACT, {
      method: 'POST',
      body: JSON.stringify({ contractAddress, chainId }),
    });
  }

  async getRecommendations(contractAddress: string): Promise<any[]> {
    return this.request<any[]>(`${API_ENDPOINTS.ANALYSIS.RECOMMENDATIONS}/${contractAddress}`);
  }

  // Alert management endpoints
  async getUserAlerts(address: string): Promise<Alert[]> {
    return this.request<Alert[]>(`${API_ENDPOINTS.ALERTS.USER}/${address}`);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    return this.request<void>(`${API_ENDPOINTS.ALERTS.ACKNOWLEDGE}/${alertId}`, {
      method: 'PUT',
    });
  }

  // Marketplace endpoints
  async getMarketplaceTemplates(): Promise<TrapTemplate[]> {
    return this.request<TrapTemplate[]>(API_ENDPOINTS.MARKETPLACE.TEMPLATES);
  }

  async getMarketplaceStats(): Promise<any> {
    return this.request<any>(API_ENDPOINTS.MARKETPLACE.STATS);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  logout(): void {
    this.clearAuthToken();
  }

  // Error handling
  handleError(error: unknown): string {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          this.clearAuthToken();
          return 'Authentication failed. Please reconnect your wallet.';
        case 403:
          return 'Access denied. You do not have permission to perform this action.';
        case 404:
          return 'Resource not found.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }
    
    return 'An unexpected error occurred.';
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export { ApiError };

// Hook for using API client in components
export function useApiClient() {
  return apiClient;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API error types
export interface ApiErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
}

// Rate limiting
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return true;
    }

    const requestTimes = this.requests.get(key)!;
    const validRequests = requestTimes.filter(time => time > windowStart);
    
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(key, validRequests);
      return true;
    }

    return false;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      return this.maxRequests;
    }

    const requestTimes = this.requests.get(key)!;
    const validRequests = requestTimes.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Create rate limiter instance
export const rateLimiter = new RateLimiter();

// Retry logic for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}