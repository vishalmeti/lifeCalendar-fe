/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define base API URL - replace with your actual API base URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// API request timeout in milliseconds
const TIMEOUT = 30000;

// Create a class for our Axios service
export class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Request interceptor for adding auth token, etc.
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling common error cases
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 (Unauthorized) errors
        if (error.response && error.response.status === 401) {
          // Clear local storage and redirect to login
          localStorage.clear();
          // You might want to use a state management solution or context to handle auth state
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method with types
  public async request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.api.request(config);
  }

  // GET request
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  // POST request
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  // PUT request
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  // PATCH request
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  // DELETE request
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;