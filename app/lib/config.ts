export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://api-test-board.com:8000/api',
    timeout: 10000,
    retryAttempts: 3,
  },

  app: {
    name: import.meta.env.VITE_APP_NAME || 'Board Yet',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    debug: import.meta.env.VITE_DEBUG === 'true',
  },

  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },

  auth: {
    tokenKey: 'auth_token',
  },

} as const;

export type Config = typeof config;

export const isDevelopment = () => config.env.isDevelopment;
export const isProduction = () => config.env.isProduction;
export const isDebugMode = () => config.app.debug;

if (isDevelopment() && isDebugMode()) {
  console.log('App Configuration:', {
    api: config.api,
    app: config.app,
    env: config.env,
  });
}

