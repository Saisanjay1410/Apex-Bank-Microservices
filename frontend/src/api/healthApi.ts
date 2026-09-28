import axios from 'axios';
import { config } from '../config/env';
import { initialMockEndpoints } from './mockData';
import type { ServiceEndpoint } from '../types';

export const healthApi = {
  checkAllServices: async (): Promise<ServiceEndpoint[]> => {
    const endpoints: ServiceEndpoint[] = [
      {
        id: 'eureka',
        name: 'Eureka Discovery Server',
        port: 8761,
        targetUrl: config.directUrls.eureka,
        status: 'CHECKING',
        description: 'Netflix Eureka Service Registry and Instance Discovery',
        category: 'core',
      },
      {
        id: 'gateway',
        name: 'Spring Cloud API Gateway',
        port: 8090,
        targetUrl: config.directUrls.gateway,
        status: 'CHECKING',
        description: 'Reactive WebFlux Gateway & Routing Proxy',
        category: 'gateway',
      },
      {
        id: 'banking',
        name: 'Banking Service',
        port: 8081,
        targetUrl: config.directUrls.banking,
        status: 'CHECKING',
        description: 'JWT Auth, Accounts, Transactions & Employee records',
        category: 'service',
      },
      {
        id: 'payroll',
        name: 'Payroll Service',
        port: 8082,
        targetUrl: config.directUrls.payroll,
        status: 'CHECKING',
        description: 'Payroll processing & Kafka event listener',
        category: 'service',
      },
      {
        id: 'chatbot',
        name: 'AI Chatbot Assistant',
        port: 8083,
        targetUrl: config.directUrls.chatbot,
        status: 'CHECKING',
        description: 'AI Query resolution with Spring RestTemplate',
        category: 'ai',
      },
    ];

    // Check each endpoint with short timeout
    const results = await Promise.all(
      endpoints.map(async (ep) => {
        const start = performance.now();
        try {
          // Probe actuator or root
          const probeUrl = `${ep.targetUrl}/actuator/health`;
          await axios.get(probeUrl, { timeout: 1500 });
          const latency = Math.round(performance.now() - start);
          return {
            ...ep,
            status: 'ONLINE' as const,
            latencyMs: latency,
            lastChecked: new Date().toLocaleTimeString(),
          };
        } catch (err: any) {
          // If we got any HTTP response (even 401 or 404), the server process is listening!
          if (err.response) {
            const latency = Math.round(performance.now() - start);
            return {
              ...ep,
              status: 'ONLINE' as const,
              latencyMs: latency,
              lastChecked: new Date().toLocaleTimeString(),
            };
          }
          // Offline / connection refused
          const mockMatch = initialMockEndpoints.find((m) => m.id === ep.id);
          return {
            ...ep,
            status: 'OFFLINE' as const,
            latencyMs: undefined,
            lastChecked: new Date().toLocaleTimeString(),
          };
        }
      })
    );

    return results;
  },
};
