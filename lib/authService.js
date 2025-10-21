// lib/authService.js
import axios from 'axios';

const SUPABASE_URL = 'https://iwoihtzagjtmrsihfwfv.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.userId = null;
    this.refreshTokenPromise = null;
  }

  // Initialize from localStorage on app start
  initialize() {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth_data');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        this.accessToken = authData.access_token;
        this.refreshToken = authData.refresh_token;
        this.tokenExpiry = authData.expires_at;
        this.userId = authData.user?.id;
      }
    }
  }

  // Save tokens after login
  setTokens(authResponse) {
    this.accessToken = authResponse.access_token;
    this.refreshToken = authResponse.refresh_token;
    this.tokenExpiry = authResponse.expires_at;
    this.userId = authResponse.user?.id;

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_data', JSON.stringify({
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token,
        expires_at: authResponse.expires_at,
        user: authResponse.user
      }));
    }
  }

  // Check if token is expired or about to expire (within 5 minutes)
  isTokenExpired() {
    if (!this.tokenExpiry) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 300; // 5 minutes buffer
    return currentTime >= (this.tokenExpiry - bufferTime);
  }

  // Refresh the access token using refresh token
  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      try {
        const response = await axios.post(
          `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
          {
            refresh_token: this.refreshToken
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY
            }
          }
        );

        if (response.data) {
          this.setTokens(response.data);
          return response.data.access_token;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.logout();
        throw error;
      } finally {
        this.refreshTokenPromise = null;
      }
    })();

    return this.refreshTokenPromise;
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken() {
    if (!this.accessToken || !this.refreshToken) {
      throw new Error('Not authenticated');
    }

    if (this.isTokenExpired()) {
      console.log('Token expired, refreshing...');
      await this.refreshAccessToken();
    }

    return this.accessToken;
  }

  // Get current user ID
  getUserId() {
    return this.userId;
  }

  // Logout and clear tokens
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.userId = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_data');
      window.location.href = '/auth'; // Redirect to login
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.accessToken && !!this.refreshToken;
  }
}

// Export singleton instance
export const authService = new AuthService();