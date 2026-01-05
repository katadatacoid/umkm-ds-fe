const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Types
export interface ProductSubscription {
  id: string;
  name: string;
  duration: string;
  price: number;
  level: number;
}

export interface Transaction {
  id: string;
  invoice_number: string;
  total_price: number;
  item_price: number;
  discount_amount: number;
  payment_status: string;
  product_subscription: ProductSubscription | null;
}

export interface Subscription {
  id: string;
  product_subscription_id: string;
  subscription_start: string;
  subscription_end: string;
  subscription_status: string;
  transaction: Transaction | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface UMKM {
  id: string;
  user_id: string;
  user_subscription_id?: string | null;
  template_id: number | null;
  name: string;
  description?: string | null;
  domain_name: string;
  banner_img?: string | null;
  logo_img?: string | null;
  address?: string | null;
  social_media_links?: any;
  phone: string;
  email?: string | null;
  ecommerce_links?: any;
  map?: string | null;
  google_analytics?: string | null;
  status: string;
  profile_photo?: string | null;
  created_at?: string;
  updated_at?: string;
  content_plan?: string | null;
  province?: string | null;
  city?: string | null;
  sector?: string | null;
  turnover?: string | null;
  user?: User | null;
  subscription?: Subscription;
}

export interface UMKMStats {
  total: number;
  active: number;
  inactive: number;
}

export interface UMKMResponse {
  success: boolean;
  data: UMKM[];
  count: number;
  stats?: UMKMStats;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface AuthCode {
  authorization_code: string;
  expires_in: number;
}

export interface DashboardStats {
  activeUmkm: number;
  monthlyTransactions: number;
  newUsers: number;
  activeUmkmPercentage: number;
  transactionsPercentage: number;
  newUsersPercentage: number;
}

// NEW: Product Types
export interface CatalogPhoto {
  id: string;
  catalog_id: string;
  path: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  caption?: string | null;
  order: number;
  is_primary?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Product {
  id: string;
  user_product_id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  current_price: number;
  original_price?: number | null;
  status: string; // "published" | "draft"
  ecommerce_links?: any;
  is_on_sale: boolean;
  created_at: string;
  updated_at: string;
  catalog_photos: CatalogPhoto[];
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface UserDashboardStats {
  total: number;
  active: number;
  nonActive: number;
}

export interface UserDashboardResponse {
  success: boolean;
  data: UserDashboardStats;
}

// Tambahkan interface ini di bagian Types
export interface Template {
  id: number;
  nama_template: string;
  deskripsi?: string | null;
  kategori?: string | null;
  preview_image?: string | null;
  created_at?: string;
}

export interface TemplatesResponse {
  success: boolean;
  data: Template[];
  count: number;
}
interface DecodedToken {
  user_id: string;
  email: string;
  name: string;
  scope?: string;
}

// Helper function to get token
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    //console.log('Getting token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    return token;
  }
  return null;
};

const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

const getTokenExpiry = (): number | null => {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('token_expiry');
    return expiry ? parseInt(expiry) : null;
  }
  return null;
};

export const saveTokens = (tokens: AuthTokens) => {
  if (typeof window !== 'undefined') {
    // console.log('Saving tokens:', tokens);
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    
    const expiryTime = Date.now() + (tokens.expires_in * 1000);
    localStorage.setItem('token_expiry', expiryTime.toString());
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    console.log('Clearing tokens');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
  }
};

const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  const timeLeft = expiry - Date.now();
  return timeLeft < 300000;
};

// Helper to check if user is admin from token
export const checkIsAdmin = (): boolean => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.scope === 'admin';
    }
  }
  return false;
};

// Helper to get user info from localStorage
export const getUserInfo = (): DecodedToken | null => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
  }
  return null;
};

// Auth API
export const authAPI = {
  async authorize(email: string, password: string): Promise<AuthCode> {
    console.log('Authorizing...', { email });
    const response = await fetch(`${API_URL}/login/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response_type: 'code',
        client_id: 'client-app-1',
        redirect_uri: 'https://oauth.pstmn.io/v1/callback',
        email,
        password,
        scope: 'profile dashboard',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || 'Authorization failed');
    }

    return response.json();
  },

  async getToken(code: string): Promise<AuthTokens> {
    // console.log('Getting token with code:', code);
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', 'https://oauth.pstmn.io/v1/callback');
    formData.append('client_id', 'client-app-1');
    formData.append('client_secret', 'top-secret-1');

    const response = await fetch(`${API_URL}/login/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Token exchange failed');
    }

    return response.json();
  },

  async refreshAccessToken(): Promise<AuthTokens> {
    console.log('Refreshing access token...');
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);
    formData.append('client_id', 'client-app-1');
    formData.append('client_secret', 'top-secret-1');

    const response = await fetch(`${API_URL}/login/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Refresh token failed:', error);
      clearTokens();
      throw new Error('Refresh token expired. Please login again.');
    }

    const tokens = await response.json();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access_token);
      const expiryTime = Date.now() + (tokens.expires_in * 1000);
      localStorage.setItem('token_expiry', expiryTime.toString());
    }

    console.log('Token refreshed successfully');
    return tokens;
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const authCode = await this.authorize(email, password);
    const tokens = await this.getToken(authCode.authorization_code);
    saveTokens(tokens);
    return tokens;
  },

  logout() {
    clearTokens();
  },
};

// Helper function for authenticated requests
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();

  if (!token) {
    throw new Error('No access token found. Please login again.');
  }

  if (isTokenExpired()) {
    console.log('Token expired or about to expire, refreshing...');
    try {
      await authAPI.refreshAccessToken();
      token = getAccessToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      clearTokens();
      window.location.href = '/';
      throw error;
    }
  }

  const headers: HeadersInit = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // Only add Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.error('Unauthorized even after refresh');
    clearTokens();
    window.location.href = '/';
    throw new Error('Unauthorized. Please login again.');
  }

  return response;
}

// UMKM API
export const umkmAPI = {
  async getAll(search?: string): Promise<UMKMResponse> {
    const url = search 
      ? `${API_URL}/umkms?search=${encodeURIComponent(search)}` 
      : `${API_URL}/umkms`;
    
    console.log('Fetching UMKM data from:', url);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch UMKMs';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Successfully fetched UMKM data:', data);
    return data;
  },

  async getAllWithSubscription(search?: string): Promise<UMKMResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('includeSubscription', 'true');

    const url = `${API_URL}/umkms?${params.toString()}`;
    console.log('Fetching UMKM data WITH subscription from:', url);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch UMKMs with subscription';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Successfully fetched UMKM data with subscription:', data);
    return data;
  },

  async getStats(): Promise<{ success: boolean; data: UMKMStats }> {
    const response = await authenticatedFetch(`${API_URL}/umkms/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch UMKM stats');
    }

    return response.json();
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('Fetching dashboard statistics...');
      
      const response = await this.getAllWithSubscription();
      
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch UMKM data');
      }

      const umkmData = response.data;
      
      const activeUmkm = umkmData.filter(umkm => umkm.status === 'active').length;
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      let monthlyTransactions = 0;
      let previousMonthTransactions = 0;
      
      umkmData.forEach(umkm => {
        if (umkm.subscription?.transaction) {
          const transaction = umkm.subscription.transaction;
          
          const transactionDate = new Date(umkm.subscription.subscription_start);
          const transMonth = transactionDate.getMonth();
          const transYear = transactionDate.getFullYear();
          
          if (transMonth === currentMonth && transYear === currentYear) {
            monthlyTransactions += transaction.total_price;
          }
          
          if (transMonth === previousMonth && transYear === previousYear) {
            previousMonthTransactions += transaction.total_price;
          }
        }
      });
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      let newUsers = 0;
      let previousNewUsers = 0;
      
      umkmData.forEach(umkm => {
        const createdDate = new Date(umkm.created_at || '');
        
        if (createdDate >= oneMonthAgo && createdDate <= now) {
          newUsers++;
        }
        
        if (createdDate >= twoMonthsAgo && createdDate < oneMonthAgo) {
          previousNewUsers++;
        }
      });
      
      const totalUmkm = response.stats?.total || umkmData.length;
      const activeUmkmPercentage = totalUmkm > 0
        ? Math.round(((activeUmkm / totalUmkm) * 100) - 100)
        : 0;
      
      const transactionsPercentage = previousMonthTransactions > 0
        ? Math.round(((monthlyTransactions - previousMonthTransactions) / previousMonthTransactions) * 100)
        : monthlyTransactions > 0 ? 100 : 0;
      
      const newUsersPercentage = previousNewUsers > 0
        ? Math.round(((newUsers - previousNewUsers) / previousNewUsers) * 100)
        : newUsers > 0 ? 100 : 0;
      
      const stats: DashboardStats = {
        activeUmkm,
        monthlyTransactions,
        newUsers,
        activeUmkmPercentage,
        transactionsPercentage,
        newUsersPercentage
      };

      console.log('Dashboard stats calculated:', stats);
      return stats;
      
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<{ success: boolean; data: UMKM }> {
    console.log(`Fetching UMKM ID: ${id}`);
    const response = await authenticatedFetch(`${API_URL}/umkms/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch UMKM with ID ${id}`);
    }

    return response.json();
  },

  async getByIdWithSubscription(id: number): Promise<{ success: boolean; data: UMKM }> {
    console.log(`Fetching UMKM ID ${id} WITH subscription and user`);
    const response = await authenticatedFetch(`${API_URL}/umkms/${id}?includeSubscription=true`);

    if (!response.ok) {
      throw new Error(`Failed to fetch UMKM with ID ${id}`);
    }

    return response.json();
  },

  async create(data: any): Promise<{ success: boolean; message: string; data: { id: string } }> {
    const response = await authenticatedFetch(`${API_URL}/umkms`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create UMKM');
    }

    return response.json();
  },

  async update(id: number, data: any): Promise<{ success: boolean; message: string }> {
    console.log(`Updating UMKM ID: ${id}`, data);
    const response = await authenticatedFetch(`${API_URL}/umkms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update UMKM');
    }

    return response.json();
  },

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await authenticatedFetch(`${API_URL}/umkms/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete UMKM');
    }

    return response.json();
  },

  async exportCSV(id?: number, search?: string): Promise<Blob> {
    let url = `${API_URL}/umkms/export`;
    const params = new URLSearchParams();
    if (id) params.append('id', id.toString());
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    console.log('Exporting CSV from:', url);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to export CSV');
      }
      throw new Error('Failed to export CSV');
    }

    return response.blob();
  },

  async exportSelected(ids: number[]): Promise<Blob> {
    if (ids.length === 0) {
      throw new Error('Tidak ada data yang dipilih untuk di-export');
    }

    const idsString = ids.join(',');
    const url = `${API_URL}/umkms/export?ids=${idsString}`;

    console.log('Exporting selected IDs:', ids);

    const response = await authenticatedFetch(url);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to export selected records');
      }
      throw new Error('Failed to export selected records');
    }

    return response.blob();
  },

  async exportAll(): Promise<Blob> {
    console.log('Exporting all records...');

    const response = await authenticatedFetch(`${API_URL}/umkms/export`);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to export all records');
      }
      throw new Error('Failed to export all records');
    }

    return response.blob();
  },
};

// Product API - SAMA SEPERTI UMKM API
export const productAPI = {
  // Get user dashboard stats
  async getDashboardStats(): Promise<UserDashboardResponse> {
    console.log('Fetching user dashboard stats...');
    const response = await authenticatedFetch(`${API_URL}/user/dashboard`);

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  },

  // ✅ SAMA SEPERTI UMKM: Get all products with search AND status
async getAll(search?: string, status?: string): Promise<ProductsResponse & { stats?: { total: number; active: number; nonActive: number } }> {
  let url = `${API_URL}/user/products`;
  
  const params = new URLSearchParams();
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  if (status) {
    params.append('status', status);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  console.log('Fetching user products from:', url);
  const response = await authenticatedFetch(url);

  if (!response.ok) {
    let errorMessage = 'Failed to fetch products';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('Successfully fetched products:', data);
  return data;
},

  // ✅ SAMA SEPERTI UMKM: Get all products for admin with search only
  async getAllAdmin(search?: string): Promise<ProductsResponse & { stats?: { total: number; active: number; nonActive: number } }> {
    let url = `${API_URL}/user/products/all`;
    
    // Only add search parameter - SAMA SEPERTI UMKM
    if (search && search.trim()) {
      url += `?search=${encodeURIComponent(search.trim())}`;
    }

    console.log('Fetching all products (admin) from:', url);
    const response = await authenticatedFetch(url);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch all products';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Get product by ID
  async getById(id: string | number): Promise<ProductResponse> {
    console.log(`Fetching product ID: ${id}`);
    const response = await authenticatedFetch(`${API_URL}/user/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${id}`);
    }

    return response.json();
  },

  // Create product
  async create(formDataOrObject: FormData | {
    name: string;
    description?: string;
    price: number;
    status: string;
    linkTokopedia?: string;
    linkShopee?: string;
    linkLazada?: string;
    linkBukalapak?: string;
    linkLainnya?: string;
    image?: File;
  }): Promise<{ success: boolean; message: string; data: { id: string } }> {
    console.log('Creating product...', formDataOrObject);
    
    let formData: FormData;
    
    if (formDataOrObject instanceof FormData) {
      formData = formDataOrObject;
    } else {
      formData = new FormData();
      formData.append('name', formDataOrObject.name);
      if (formDataOrObject.description) formData.append('description', formDataOrObject.description);
      formData.append('price', formDataOrObject.price.toString());
      formData.append('status', formDataOrObject.status);
      
      if (formDataOrObject.linkTokopedia) formData.append('linkTokopedia', formDataOrObject.linkTokopedia);
      if (formDataOrObject.linkShopee) formData.append('linkShopee', formDataOrObject.linkShopee);
      if (formDataOrObject.linkLazada) formData.append('linkLazada', formDataOrObject.linkLazada);
      if (formDataOrObject.linkBukalapak) formData.append('linkBukalapak', formDataOrObject.linkBukalapak);
      if (formDataOrObject.linkLainnya) formData.append('linkLainnya', formDataOrObject.linkLainnya);
      
      if (formDataOrObject.image) formData.append('image', formDataOrObject.image);
    }

    const response = await authenticatedFetch(`${API_URL}/user/products`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }

    return response.json();
  },

  // Update product
  async update(id: string | number, formDataOrObject: FormData | {
    name?: string;
    description?: string;
    price?: number;
    status?: string;
    linkTokopedia?: string;
    linkShopee?: string;
    linkLazada?: string;
    linkBukalapak?: string;
    linkLainnya?: string;
    image?: File;
  }): Promise<{ success: boolean; message: string }> {
    console.log(`Updating product ID: ${id}`, formDataOrObject);
    
    let formData: FormData;
    
    if (formDataOrObject instanceof FormData) {
      formData = formDataOrObject;
    } else {
      formData = new FormData();
      if (formDataOrObject.name) formData.append('name', formDataOrObject.name);
      if (formDataOrObject.description !== undefined) formData.append('description', formDataOrObject.description);
      if (formDataOrObject.price) formData.append('price', formDataOrObject.price.toString());
      if (formDataOrObject.status) formData.append('status', formDataOrObject.status);
      
      if (formDataOrObject.linkTokopedia !== undefined) formData.append('linkTokopedia', formDataOrObject.linkTokopedia);
      if (formDataOrObject.linkShopee !== undefined) formData.append('linkShopee', formDataOrObject.linkShopee);
      if (formDataOrObject.linkLazada !== undefined) formData.append('linkLazada', formDataOrObject.linkLazada);
      if (formDataOrObject.linkBukalapak !== undefined) formData.append('linkBukalapak', formDataOrObject.linkBukalapak);
      if (formDataOrObject.linkLainnya !== undefined) formData.append('linkLainnya', formDataOrObject.linkLainnya);
      
      if (formDataOrObject.image) formData.append('image', formDataOrObject.image);
    }

    const response = await authenticatedFetch(`${API_URL}/user/products/${id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }

    return response.json();
  },

  // Delete product
  async delete(id: string | number): Promise<{ success: boolean; message: string }> {
    console.log(`Deleting product ID: ${id}`);
    const response = await authenticatedFetch(`${API_URL}/user/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    return response.json();
  },

  
};

// Template API - Tambahkan setelah productAPI
export const templateAPI = {
  async getAll(): Promise<TemplatesResponse> {
    console.log('Fetching templates...');
    const response = await authenticatedFetch(`${API_URL}/templates`);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch templates';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Successfully fetched templates:', data);
    return data;
  },

  async getById(id: number): Promise<{ success: boolean; data: Template }> {
    console.log(`Fetching template ID: ${id}`);
    const response = await authenticatedFetch(`${API_URL}/templates/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch template with ID ${id}`);
    }

    return response.json();
  },
};