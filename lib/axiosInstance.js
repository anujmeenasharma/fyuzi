// lib/axiosInstance.js
import axios from 'axios';
import { authService } from './authService';

const SUPABASE_URL = 'https://iwoihtzagjtmrsihfwfv.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY
  }
});

// Request interceptor - Add access token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get valid access token (will refresh if needed)
      const token = await authService.getValidAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get access token:', error);
      // Let the request proceed without token, will fail at server
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await authService.refreshAccessToken();
        
        // Retry original request with new token
        const token = await authService.getValidAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;