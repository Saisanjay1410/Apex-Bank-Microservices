import { apiClient, executeApi } from './client';
import { mockService } from './mockService';
import { config } from '../config/env';
import type { ChatRequest, ChatResponse } from '../types';

const BASE_URL = config.endpoints.chatbot;

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    return executeApi(
      () => apiClient.post<ChatResponse>(`${BASE_URL}/api/chat`, request),
      () => mockService.chat(request),
      'AI Chatbot Service'
    );
  },
};
