import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api/healthApi';
import { mockService } from '../api/mockService';
import { useAuthStore } from '../store/useAuthStore';
import type { ServiceEndpoint } from '../types';

export const HEALTH_KEY = ['microservices-health'];

export function useHealth() {
  const isMock = useAuthStore((state) => state.mockMode);

  return useQuery<ServiceEndpoint[]>({
    queryKey: HEALTH_KEY,
    queryFn: async () => {
      if (isMock) {
        return mockService.getEndpointsHealth();
      }
      return healthApi.checkAllServices();
    },
    refetchInterval: 12000, // Refresh every 12 seconds
    staleTime: 8000,
  });
}
