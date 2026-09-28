/**
 * Environment Configuration
 * Provides typed access to all environment variables with graceful defaults.
 */

const isDev = import.meta.env.DEV;

export const config = {
  env: import.meta.env.VITE_ENV || (isDev ? 'development' : 'production'),
  appName: import.meta.env.VITE_APP_NAME || 'Apex Banking Microservices',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  useDevProxy: import.meta.env.VITE_USE_DEV_PROXY === 'true' || isDev,
  defaultMockFallback: import.meta.env.VITE_DEFAULT_MOCK_FALLBACK !== 'false',

  // Microservices Base URLs
  endpoints: {
    // If dev proxy is enabled, requests route via Vite's proxy rules
    gateway: (import.meta.env.VITE_USE_DEV_PROXY === 'true' && isDev)
      ? '/api/gateway'
      : (import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8090'),

    banking: (import.meta.env.VITE_USE_DEV_PROXY === 'true' && isDev)
      ? '/api/banking'
      : (import.meta.env.VITE_BANKING_SERVICE_URL || 'http://localhost:8081'),

    payroll: (import.meta.env.VITE_USE_DEV_PROXY === 'true' && isDev)
      ? '/api/payroll'
      : (import.meta.env.VITE_PAYROLL_SERVICE_URL || 'http://localhost:8082'),

    chatbot: (import.meta.env.VITE_USE_DEV_PROXY === 'true' && isDev)
      ? '/api/chatbot'
      : (import.meta.env.VITE_CHATBOT_SERVICE_URL || 'http://localhost:8083'),

    eureka: (import.meta.env.VITE_USE_DEV_PROXY === 'true' && isDev)
      ? '/api/eureka'
      : (import.meta.env.VITE_EUREKA_SERVER_URL || 'http://localhost:8761'),
  },

  // Direct backend origins (useful for health checks & ping inspection)
  directUrls: {
    gateway: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8090',
    banking: import.meta.env.VITE_BANKING_SERVICE_URL || 'http://localhost:8081',
    payroll: import.meta.env.VITE_PAYROLL_SERVICE_URL || 'http://localhost:8082',
    chatbot: import.meta.env.VITE_CHATBOT_SERVICE_URL || 'http://localhost:8083',
    eureka: import.meta.env.VITE_EUREKA_SERVER_URL || 'http://localhost:8761',
  },
};
