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
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseURL}${cleanEndpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-App-Name': appConfig.app.name,
      'X-App-Version': appConfig.app.version,
    };

    const currentToken = this.authToken || (typeof window !== 'undefined' ? localStorage.getItem('board_yet_auth_token') : null);
    
    if (currentToken) {
      defaultHeaders['Authorization'] = `Bearer ${currentToken}`;
    }

    const requestConfig: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestConfig);
      
      if (response.status === 401 && this.authToken) {
        this.clearAuthToken();
        
        import('../lib/auth').then(({ clearAuthToken }) => {
          clearAuthToken();
        });
        
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = '/';
        }
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

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  clearAuthToken() {
    this.authToken = null;
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
    ME: '/auth/me',
  },
  ORGANIZATION: {
    CREATE: '/organizations',
    GET_BY_SUBDOMAIN: '/organizations/subdomain/{subdomain}',
    GET_SETTINGS: '/organizations/{id}/settings',
    UPDATE_SETTINGS: '/organizations/{id}/settings',
    VALIDATE_SUBDOMAIN: '/organizations/subdomain/validate',
    INVITE: '/organizations/{id}/invite',
    ACCEPT_INVITATION: '/organizations/invitations/accept',
    LIST: '/organizations/invitations/details/{token}'
  },
  USER: {
    LIST: '/users/{organizationId}/members',
  },
  BOARD: {
    LIST_ALL: '/boards',
    CREATE: '/boards',
    LIST: '/boards/{id}',
  },
  COLUMN: {
    CREATE: '/columns',
    UPDATE: '/columns/{id}',
    DELETE: '/columns/{id}',
    REORDER: '/columns/reorder',
    LIST: '/boards/{boardId}/columns'
  },
  TASK: {
    CREATE: '/columns/{columnId}/cards',
    UPDATE: '/cards/{id}',
    DELETE: '/cards/{id}',
    LIST: '/columns/{columnId}/cards'
  }
} as const;
