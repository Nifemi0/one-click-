export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  priceInEth: number;
  category: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  securityLevel: 'Low' | 'Medium' | 'High';
  tags: string[];
  author: string;
  lastUpdated: string;
  preview: string;
  contractCode: string;
  deploymentTime: string;
  features: string[];
  transactionHash?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  downloads?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
}

export interface MarketplaceFilters {
  category?: string;
  difficulty?: string;
  securityLevel?: string;
  priceRange?: { min: number; max: number };
  search?: string;
  sortBy?: 'price' | 'rating' | 'downloads' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  icon?: string;
}

export interface MarketplacePurchase {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  purchaseDate: string;
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
  userAddress: string;
}

export interface MarketplaceStats {
  totalItems: number;
  totalCategories: number;
  totalPurchases: number;
  totalRevenue: number;
  popularCategories: { category: string; count: number }[];
  topRatedItems: { itemId: string; name: string; rating: number }[];
}
