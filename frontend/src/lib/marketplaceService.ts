import { MarketplaceItem } from '../types/marketplace';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://one-click-c308.onrender.com';

export class MarketplaceService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  static async getMarketplaceItems(filters?: {
    category?: string;
    difficulty?: string;
    securityLevel?: string;
    priceRange?: { min: number; max: number };
    search?: string;
  }): Promise<MarketplaceItem[]> {
    try {
      let endpoint = '/api/marketplace/items';
      const params = new URLSearchParams();

      if (filters?.category) params.append('category', filters.category);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.securityLevel) params.append('securityLevel', filters.securityLevel);
      if (filters?.priceRange) {
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
      }
      if (filters?.search) params.append('search', filters.search);

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const data = await this.makeRequest<{ items: MarketplaceItem[] }>(endpoint);
      return data.items || [];
    } catch (error) {
      console.error('Failed to fetch marketplace items:', error);
      return [];
    }
  }

  static async getMarketplaceItem(id: string): Promise<MarketplaceItem | null> {
    try {
      const data = await this.makeRequest<{ item: MarketplaceItem }>(`/api/marketplace/items/${id}`);
      return data.item || null;
    } catch (error) {
      console.error('Failed to fetch marketplace item:', error);
      return null;
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const data = await this.makeRequest<{ categories: string[] }>('/api/marketplace/categories');
      return data.categories || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  static async getDifficulties(): Promise<string[]> {
    try {
      const data = await this.makeRequest<{ difficulties: string[] }>('/api/marketplace/difficulties');
      return data.difficulties || [];
    } catch (error) {
      console.error('Failed to fetch difficulties:', error);
      return [];
    }
  }

  static async getSecurityLevels(): Promise<string[]> {
    try {
      const data = await this.makeRequest<{ securityLevels: string[] }>('/api/marketplace/security-levels');
      return data.securityLevels || [];
    } catch (error) {
      console.error('Failed to fetch security levels:', error);
      return [];
    }
  }

  static async purchaseItem(itemId: string, userAddress: string, quantity: number = 1): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          userAddress,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Purchase failed');
      }

      const data = await response.json();
      return {
        success: true,
        transactionHash: data.transactionHash,
      };
    } catch (error) {
      console.error('Failed to purchase item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
      };
    }
  }

  static async getPurchaseHistory(userAddress: string): Promise<{
    id: string;
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
    purchaseDate: string;
    transactionHash: string;
  }[]> {
    try {
      const data = await this.makeRequest<{ purchases: any[] }>(`/api/marketplace/purchases?userAddress=${userAddress}`);
      return data.purchases || [];
    } catch (error) {
      console.error('Failed to fetch purchase history:', error);
      return [];
    }
  }

  static async getPopularItems(limit: number = 10): Promise<MarketplaceItem[]> {
    try {
      const data = await this.makeRequest<{ items: MarketplaceItem[] }>(`/api/marketplace/popular?limit=${limit}`);
      return data.items || [];
    } catch (error) {
      console.error('Failed to fetch popular items:', error);
      return [];
    }
  }

  static async getFeaturedItems(): Promise<MarketplaceItem[]> {
    try {
      const data = await this.makeRequest<{ items: MarketplaceItem[] }>('/api/marketplace/featured');
      return data.items || [];
    } catch (error) {
      console.error('Failed to fetch featured items:', error);
      return [];
    }
  }
}
