
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  organization_id?: number;
  subdomain?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

import { loginUser as apiLoginUser } from '../api/auth/login';
import { signupUser as apiSignupUser } from '../api/auth/signup';
import { logoutUser as apiLogoutUser } from '../api/auth/logout';
import { getCurrentUser as apiGetCurrentUser } from '../api/auth/me';

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const result = await apiLoginUser(credentials);
  
  if (result.success && result.token) {
    const expiresIn = (result as any).expires_in || 3600;
    storeAuthToken(result.token, expiresIn);
  }
  
  return result;
}

export async function signupUser(credentials: SignupCredentials): Promise<AuthResponse> {
  const result = await apiSignupUser(credentials);

  if (result.success && result.token) {
    const expiresIn = (result as any).expires_in || 3600;
    storeAuthToken(result.token, expiresIn);
  }
  
  return result;
}

export async function logoutUser() {
  const result = await apiLogoutUser();
  clearAuthToken();

  return result;
}

let authToken: string | null = null;
let tokenExpiry: number | null = null;

const TOKEN_KEY = 'board_yet_auth_token';
const EXPIRY_KEY = 'board_yet_token_expiry';

export function storeAuthToken(token: string, expiresIn?: number) {
  authToken = token;
  
  if (expiresIn) {
    tokenExpiry = Date.now() + (expiresIn * 1000);
  }
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (tokenExpiry) {
        localStorage.setItem(EXPIRY_KEY, tokenExpiry.toString());
      }
      
      const expiryDate = new Date();
      if (expiresIn) {
        expiryDate.setTime(expiryDate.getTime() + (expiresIn * 1000));
      } else {
        expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000));
      }
      
      document.cookie = `${TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; domain=.boardyet.com; path=/; secure; samesite=strict`;
      
      if (tokenExpiry) {
        document.cookie = `${EXPIRY_KEY}=${tokenExpiry}; expires=${expiryDate.toUTCString()}; domain=.boardyet.com; path=/; secure; samesite=strict`;
      }
    } catch (error) {
      console.warn('Failed to store token:', error);
    }
  }
  
  import('./api').then(({ apiClient }) => {
    apiClient.setAuthToken(token);
  });
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export function getAuthToken(): string | null {
  if (authToken) {
    return authToken;
  }
  
  if (typeof window !== 'undefined') {
    try {
      let storedToken = getCookie(TOKEN_KEY);
      let storedExpiry = getCookie(EXPIRY_KEY);
      
      if (!storedToken) {
        storedToken = localStorage.getItem(TOKEN_KEY);
        storedExpiry = localStorage.getItem(EXPIRY_KEY);
      }
      
      if (storedToken && storedExpiry) {
        const expiryTime = parseInt(storedExpiry);
        
        if (Date.now() < expiryTime) {
          authToken = storedToken;
          tokenExpiry = expiryTime;
          
          import('./api').then(({ apiClient }) => {
            apiClient.setAuthToken(storedToken);
          });
          
          return storedToken;
        } else {
          clearAuthToken();
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve token:', error);
    }
  }
  
  return null;
}

export function clearAuthToken() {
  authToken = null;
  tokenExpiry = null;
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      
      document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.boardyet.com; path=/;`;
      document.cookie = `${EXPIRY_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.boardyet.com; path=/;`;
    } catch (error) {
      console.warn('Failed to clear token:', error);
    }
  }
  
  import('./api').then(({ apiClient }) => {
    apiClient.clearAuthToken();
  });
}

export function isTokenExpired(): boolean {
  if (!tokenExpiry) {
    return false;
  }
  return Date.now() >= tokenExpiry;
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token || isTokenExpired()) {
    if (isTokenExpired()) {
      clearAuthToken();
    }
    return false;
  }
  return true;
}

export function hasRole(requiredRole: string, user?: User): boolean {
  if (!user?.role) return false;
  
  const roleHierarchy = {
    'admin': 3,
    'member': 2,
    'viewer': 1
  };
  
  const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userRoleLevel >= requiredRoleLevel;
}

export function isAdmin(user?: User): boolean {
  return hasRole('admin', user);
}

export function isMember(user?: User): boolean {
  return hasRole('member', user);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  return await apiGetCurrentUser();
}
