import { config as appConfig } from './config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-App-Name': appConfig.app.name,
      'X-App-Version': appConfig.app.version,
    };

    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const requestConfig: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (appConfig.app.debug) {
      console.log(`API Request: ${options.method || 'GET'} ${url}`, {
        headers: defaultHeaders,
        body: options.body
      });
    }

    try {
      const response = await fetch(url, requestConfig);
      
      if (appConfig.app.debug) {
        console.log(`API Response: ${response.status} ${response.statusText}`, {
          url,
          status: response.status,
          ok: response.ok
        });
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 && data.message) {
          const errorMessage = data.message;
          
          if (appConfig.app.debug) {
            console.error('API Validation Error:', {
              url,
              status: response.status,
              error: errorMessage,
              data
            });
          }

          return {
            success: false,
            error: errorMessage,
            data: data
          };
        }

        const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
        
        if (appConfig.app.debug) {
          console.error('API Error:', {
            url,
            status: response.status,
            error: errorMessage,
            data
          });
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      
      if (appConfig.app.debug) {
        console.error('API Network Error:', {
          url,
          error: errorMessage,
          originalError: error
        });
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(appConfig.api.baseURL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
  },
  ORGANIZATION: {
    INVITE: '/organizations/{id}/invite'
  }
} as const;
