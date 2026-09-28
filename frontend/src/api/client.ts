import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { config } from '../config/env';

// Create base Axios instance
export const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors, 401s, 403s, and network failures
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const { addToast } = useToastStore.getState();
    const { logout, mockMode } = useAuthStore.getState();

    // Check if network error (backend server offline / port closed)
    if (!error.response) {
      if (!mockMode) {
        addToast({
          type: 'warning',
          title: 'Backend Service Unreachable',
          description: 'The Spring Boot service could not be reached. You can toggle Mock Mode in the navbar to test seamlessly.',
          duration: 6000,
        });
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message || error.response.data?.error;

    if (status === 401) {
      logout();
      addToast({
        type: 'warning',
        title: 'Session Expired',
        description: serverMessage || 'Your authentication token is invalid or has expired. Please sign in.',
      });
    } else if (status === 403) {
      addToast({
        type: 'error',
        title: 'Access Forbidden',
        description: serverMessage || 'You do not have the required permissions for this operation.',
      });
    } else if (status >= 400 && status < 500) {
      addToast({
        type: 'error',
        title: 'Request Failed',
        description: serverMessage || `Error ${status}: Bad Request`,
      });
    } else if (status >= 500) {
      addToast({
        type: 'error',
        title: 'Server Error',
        description: serverMessage || 'An unexpected error occurred in the Spring Boot microservice.',
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Universal wrapper that respects `mockMode` and handles network fallbacks gracefully
 */
export async function executeApi<T>(
  networkCall: () => Promise<{ data: T }>,
  mockCall: () => Promise<T>,
  serviceName: string
): Promise<T> {
  const isMock = useAuthStore.getState().mockMode;

  if (isMock) {
    return await mockCall();
  }

  try {
    const response = await networkCall();
    return response.data;
  } catch (error) {
    const axiosErr = error as AxiosError;
    // If backend was offline (no response) and fallback is allowed:
    if (!axiosErr.response && config.defaultMockFallback) {
      console.warn(`[Fallback] ${serviceName} offline. Falling back to mock data.`);
      useToastStore.getState().addToast({
        type: 'info',
        title: `${serviceName} Offline`,
        description: 'Auto-switched to mock fallback so you can continue testing.',
        duration: 3500,
      });
      return await mockCall();
    }
    throw error;
  }
}
