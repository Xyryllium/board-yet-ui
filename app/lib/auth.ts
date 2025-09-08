
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
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  current_organization_id: number;
}

export interface AuthResponse {
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

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiLoginUser(credentials);
}

export async function signupUser(credentials: SignupCredentials): Promise<AuthResponse> {
  return apiSignupUser(credentials);
}

export function storeAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
