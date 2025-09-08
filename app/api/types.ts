export interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}