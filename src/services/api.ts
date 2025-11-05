import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  Persona,
  PersonaDetail,
  MediaContent,
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  ChatResponse,
  FollowRequest,
  FollowStatus
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  }
};

// Persona API
export const personaApi = {
  async getPersonas(): Promise<Persona[]> {
    const response = await api.get<{ personas: Persona[] }>('/personas');
    return response.data.personas;
  },

  async getPersona(personaId: string): Promise<PersonaDetail> {
    const response = await api.get<PersonaDetail>(`/personas/${personaId}`);
    return response.data;
  }
};

// Media API
export const mediaApi = {
  async getPersonaMedia(personaId: string): Promise<MediaContent[]> {
    const response = await api.get<{ media: MediaContent[] }>(`/personas/${personaId}/media`);
    return response.data.media;
  }
};

// Chat API
export const chatApi = {
  async getUserConversations(): Promise<Conversation[]> {
    const response = await api.get<{ conversations: Conversation[] }>('/conversations');
    return response.data.conversations;
  },

  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    const response = await api.post<Conversation>('/conversations', request);
    return response.data;
  },

  async getConversationMessages(conversationId: string): Promise<{ messages: Message[], conversation_progress: any, conversation: Conversation }> {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(conversationId: string, request: SendMessageRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>(`/conversations/${conversationId}/messages`, request);
    return response.data;
  },

  async deleteAllMessages(conversationId: string): Promise<void> {
    await api.delete(`/conversations/${conversationId}/messages`);
  }
};

// Follow API
export const followApi = {
  async createFollowRequest(personaId: string): Promise<FollowStatus> {
    const response = await api.post<FollowStatus>('/follow', { personaId });
    return response.data;
  },

  async getFollowStatus(personaId: string): Promise<FollowStatus> {
    const response = await api.get<FollowStatus>(`/follow/${personaId}`);
    return response.data;
  }
};

export default api;
