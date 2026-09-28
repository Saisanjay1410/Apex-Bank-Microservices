import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Direct proxy to Spring Boot Banking Service
      '/api/banking': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/banking/, ''),
      },
      // Direct proxy to Spring Boot Payroll Service
      '/api/payroll': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payroll/, ''),
      },
      // Direct proxy to Spring Boot AI-Chatbot Service
      '/api/chatbot': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chatbot/, ''),
      },
      // Proxy to Spring Cloud API-Gateway
      '/api/gateway': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gateway/, ''),
      },
      // Proxy to Eureka Server dashboard
      '/api/eureka': {
        target: 'http://localhost:8761',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/eureka/, ''),
      },
    },
  },
});
