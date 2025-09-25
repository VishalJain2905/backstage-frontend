const API_BASE_URL = 'http://localhost:3001/api';

interface User {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
  authMethod: 'email' | 'wallet' | 'both';
  isWalletVerified: boolean;
  isEmailVerified: boolean;
  profilePicture?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  needsWalletConnection?: boolean;
}

interface WalletLoginResponse {
  user?: User;
  token?: string;
  needsRegistration?: boolean;
  walletAddress?: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  walletAddress?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface WalletLoginData {
  walletAddress: string;
  signature: string;
  message: string;
}

interface CompleteWalletRegistrationData {
  walletAddress: string;
  email: string;
  username: string;
  password: string;
}

interface ConnectWalletData {
  walletAddress: string;
  signature: string;
  message: string;
}

class AuthApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  private clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Traditional registration
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Traditional login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Wallet login
  async walletLogin(data: WalletLoginData): Promise<WalletLoginResponse> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/wallet-login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Complete wallet registration
  async completeWalletRegistration(data: CompleteWalletRegistrationData): Promise<AuthResponse> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/complete-wallet-registration`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // Connect wallet to existing account
  async connectWallet(data: ConnectWalletData): Promise<{ user: User }> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/connect-wallet`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get user profile
  async getProfile(): Promise<User> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/profile`);
  }

  // Update profile
  async updateProfile(data: { username?: string; profilePicture?: string }): Promise<User> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Verify token
  async verifyToken(): Promise<{ valid: boolean; user: any }> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/verify-token`);
  }

  // Get nonce for wallet signature
  async getNonce(): Promise<{ nonce: string }> {
    return this.fetchWithAuth(`${API_BASE_URL}/auth/nonce`);
  }

  // Logout
  logout() {
    this.clearToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }
}

export const authApiService = new AuthApiService();
export type { User, AuthResponse, WalletLoginResponse, RegisterData, LoginData, WalletLoginData, CompleteWalletRegistrationData, ConnectWalletData };
