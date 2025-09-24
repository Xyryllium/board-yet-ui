
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

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiLoginUser(credentials);
}

export async function signupUser(credentials: SignupCredentials): Promise<AuthResponse> {
  return apiSignupUser(credentials);
}

export async function logoutUser() {
  return apiLogoutUser();
}

export function storeAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getUserRole(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

export function hasRole(requiredRole: string): boolean {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  const roleHierarchy = {
    'admin': 3,
    'member': 2,
    'viewer': 1
  };
  
  const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userRoleLevel >= requiredRoleLevel;
}

export function isAdmin(): boolean {
  return hasRole('admin');
}

export function isMember(): boolean {
  return hasRole('member');
}

export function storeUserData(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
}

export function getUserData(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

export function clearUserData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data');
  }
}
