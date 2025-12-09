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

// NEW: User Type
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
  user?: User | null; // Data dari tabel users
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

// Dashboard Stats Interface
export interface DashboardStats {
  activeUmkm: number;
  monthlyTransactions: number;
  newUsers: number;
  activeUmkmPercentage: number;
  transactionsPercentage: number;
  newUsersPercentage: number;
}

//  Helper function to get token from localStorage
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    console.log('Getting token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    return token;
  }
  return null;
};

//  Helper function to get refresh token
const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

//  Helper function to get token expiry time
const getTokenExpiry = (): number | null => {
  if (typeof window !== 'undefined') {
    const expiry = localStorage.getItem('token_expiry');
    return expiry ? parseInt(expiry) : null;
  }
  return null;
};

//  Helper function to save tokens with expiry
export const saveTokens = (tokens: AuthTokens) => {
  if (typeof window !== 'undefined') {
    console.log('Saving tokens:', tokens);
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    
    // Simpan waktu expiry (sekarang + expires_in dalam detik)
    const expiryTime = Date.now() + (tokens.expires_in * 1000);
    localStorage.setItem('token_expiry', expiryTime.toString());
  }
};

//  Helper function to clear tokens
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    console.log('Clearing tokens');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expiry');
  }
};

//  Helper function to check if token is expired or about to expire
const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  // Token dianggap expired jika tersisa kurang dari 5 menit (300000 ms)
  const timeLeft = expiry - Date.now();
  return timeLeft < 300000; // 5 menit buffer
};

// Auth API
export const authAPI = {
  // Step 1: Get authorization code
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

  // Step 2: Exchange code for tokens
  async getToken(code: string): Promise<AuthTokens> {
    console.log('Getting token with code:', code);
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

  //  NEW: Refresh access token using refresh token
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
      // Jika refresh token expired, clear semua token
      clearTokens();
      throw new Error('Refresh token expired. Please login again.');
    }

    const tokens = await response.json();
    
    // Update access token tapi keep refresh token yang lama
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access_token);
      const expiryTime = Date.now() + (tokens.expires_in * 1000);
      localStorage.setItem('token_expiry', expiryTime.toString());
    }

    console.log(' Token refreshed successfully');
    return tokens;
  },

  // Combined login function
  async login(email: string, password: string): Promise<AuthTokens> {
    const authCode = await this.authorize(email, password);
    const tokens = await this.getToken(authCode.authorization_code);
    saveTokens(tokens);
    return tokens;
  },

  // Logout
  logout() {
    clearTokens();
  },
};

//  Helper function to make authenticated requests with auto-refresh
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();

  if (!token) {
    throw new Error('No access token found. Please login again.');
  }

  //  Check if token is expired or about to expire
  if (isTokenExpired()) {
    console.log('Token expired or about to expire, refreshing...');
    try {
      await authAPI.refreshAccessToken();
      token = getAccessToken(); // Get new token
    } catch (error) {
      console.error('Failed to refresh token:', error);
      clearTokens();
      window.location.href = '/';
      throw error;
    }
  }

  // Make request with token
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  //  If still unauthorized after refresh, logout
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
  // Get all UMKMs with optional search (TANPA subscription)
  async getAll(search?: string): Promise<UMKMResponse> {
    const url = search 
      ? `${API_URL}/umkms?search=${encodeURIComponent(search)}` 
      : `${API_URL}/umkms`;
    
    console.log(' Fetching UMKM data from:', url);

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
    console.log(' Successfully fetched UMKM data:', data);
    return data;
  },

  // NEW: Get all UMKMs DENGAN subscription (paket & harga) DAN user data
  async getAllWithSubscription(search?: string): Promise<UMKMResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('includeSubscription', 'true');

    const url = `${API_URL}/umkms?${params.toString()}`;
    console.log(' Fetching UMKM data WITH subscription from:', url);

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
    console.log(' Successfully fetched UMKM data with subscription:', data);
    return data;
  },

  // Get UMKM statistics only
  async getStats(): Promise<{ success: boolean; data: UMKMStats }> {
    const response = await authenticatedFetch(`${API_URL}/umkms/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch UMKM stats');
    }

    return response.json();
  },

  // NEW: Get Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('Fetching dashboard statistics...');
      
      // Ambil data UMKM dengan subscription
      const response = await this.getAllWithSubscription();
      
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch UMKM data');
      }

      const umkmData = response.data;
      
      // 1. Hitung UMKM Aktif (status === 'active')
      const activeUmkm = umkmData.filter(umkm => umkm.status === 'active').length;
      
      // 2. Hitung total transaksi bulan ini
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-11
      const currentYear = now.getFullYear();
      
      // Untuk bulan sebelumnya
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      let monthlyTransactions = 0;
      let previousMonthTransactions = 0;
      
      umkmData.forEach(umkm => {
        if (umkm.subscription?.transaction) {
          const transaction = umkm.subscription.transaction;
          
          // Gunakan subscription_start sebagai tanggal transaksi
          const transactionDate = new Date(umkm.subscription.subscription_start);
          const transMonth = transactionDate.getMonth();
          const transYear = transactionDate.getFullYear();
          
          // Hitung transaksi bulan ini
          if (transMonth === currentMonth && transYear === currentYear) {
            monthlyTransactions += transaction.total_price;
          }
          
          // Hitung transaksi bulan lalu (untuk persentase)
          if (transMonth === previousMonth && transYear === previousYear) {
            previousMonthTransactions += transaction.total_price;
          }
        }
      });
      
      // 3. Hitung pengguna baru (UMKM yang dibuat 1 bulan terakhir)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      
      let newUsers = 0;
      let previousNewUsers = 0;
      
      umkmData.forEach(umkm => {
        const createdDate = new Date(umkm.created_at || '');
        
        // UMKM yang dibuat dalam 1 bulan terakhir
        if (createdDate >= oneMonthAgo && createdDate <= now) {
          newUsers++;
        }
        
        // UMKM yang dibuat 1-2 bulan yang lalu (untuk persentase)
        if (createdDate >= twoMonthsAgo && createdDate < oneMonthAgo) {
          previousNewUsers++;
        }
      });
      
      // 4. Hitung persentase perubahan
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

  // Get UMKM by ID (TANPA subscription)
  async getById(id: number): Promise<{ success: boolean; data: UMKM }> {
    console.log(` Fetching UMKM ID: ${id}`);
    const response = await authenticatedFetch(`${API_URL}/umkms/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch UMKM with ID ${id}`);
    }

    return response.json();
  },

  // NEW: Get UMKM by ID DENGAN subscription DAN user data
  async getByIdWithSubscription(id: number): Promise<{ success: boolean; data: UMKM }> {
    console.log(` Fetching UMKM ID ${id} WITH subscription and user`);
    const response = await authenticatedFetch(`${API_URL}/umkms/${id}?includeSubscription=true`);

    if (!response.ok) {
      throw new Error(`Failed to fetch UMKM with ID ${id}`);
    }

    return response.json();
  },

  // Create UMKM
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

  // Update UMKM
  async update(id: number, data: any): Promise<{ success: boolean; message: string }> {
    console.log(` Updating UMKM ID: ${id}`, data);
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

  // Delete UMKM
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

  // ✅ Export CSV - Single ID or Search
  async exportCSV(id?: number, search?: string): Promise<Blob> {
    let url = `${API_URL}/umkms/export`;
    const params = new URLSearchParams();
    if (id) params.append('id', id.toString());
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;

    console.log('📤 Exporting CSV from:', url);

    const response = await authenticatedFetch(url);

    // ✅ Cek jika response adalah error JSON (bukan CSV)
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

  // ✅ Export CSV - Selected IDs
  async exportSelected(ids: number[]): Promise<Blob> {
    if (ids.length === 0) {
      throw new Error('Tidak ada data yang dipilih untuk di-export');
    }

    const idsString = ids.join(',');
    const url = `${API_URL}/umkms/export?ids=${idsString}`;

    console.log('📤 Exporting selected IDs:', ids);

    const response = await authenticatedFetch(url);

    // ✅ Cek jika response adalah error JSON (bukan CSV)
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

  // ✅ Export All Records
  async exportAll(): Promise<Blob> {
    console.log('📤 Exporting all records...');

    const response = await authenticatedFetch(`${API_URL}/umkms/export`);

    // ✅ Cek jika response adalah error JSON (bukan CSV)
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