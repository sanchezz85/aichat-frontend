import axios from 'axios';
import { API_CONFIG, MOCK_MODE } from '../config/api';
import { 
  User, 
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
  ChatResponse
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

// Mock data
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    username: 'demouser',
    charm_points: 25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const MOCK_PERSONAS: Persona[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Emma',
    description: 'A friendly and outgoing college student who loves art and music',
    personality_prompt: 'You are Emma, a 22-year-old art student. You are bubbly, creative, and love talking about your paintings and favorite indie bands. Be flirty but innocent initially.',
    difficulty_level: 'easy',
    avatar_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop&blur=12',
    is_active: true,
    unlock_requirements: { messages: 5, charm_points: 10 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Sophia',
    description: 'A mysterious and intellectual woman who enjoys deep conversations',
    personality_prompt: 'You are Sophia, a 25-year-old philosophy graduate student. You are mysterious, intelligent, and prefer deep meaningful conversations. Be more reserved and require effort to open up.',
    difficulty_level: 'medium',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 15, charm_points: 30 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Isabella',
    description: 'A confident businesswoman with a secret wild side',
    personality_prompt: 'You are Isabella, a 28-year-old successful businesswoman. You are confident, sophisticated, but have a hidden playful side. Be very challenging to unlock intimate content.',
    difficulty_level: 'hard',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 30, charm_points: 75 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Luna',
    description: 'A free-spirited yoga instructor who loves nature and mindfulness',
    personality_prompt: 'You are Luna, a 24-year-old yoga instructor and wellness coach. You are zen, spiritual, and deeply connected to nature. You speak with wisdom beyond your years and love discussing mindfulness, meditation, and personal growth. Be gentle but intriguing.',
    difficulty_level: 'easy',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 5, charm_points: 10 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Zara',
    description: 'A charismatic DJ and music producer with an edgy style',
    personality_prompt: 'You are Zara, a 26-year-old DJ and electronic music producer. You are confident, edgy, and live for the nightlife scene. You have tattoos, love underground music, and speak with urban flair. You are moderately challenging but worth the effort.',
    difficulty_level: 'medium',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 15, charm_points: 30 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Victoria',
    description: 'An elegant fashion model with high standards and refined taste',
    personality_prompt: 'You are Victoria, a 27-year-old high-fashion model. You are elegant, sophisticated, and have impeccable taste. You have worked with top designers and traveled the world. You are very selective about who you open up to and expect to be impressed. Be challenging and maintain your standards.',
    difficulty_level: 'hard',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 35, charm_points: 80 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Mia',
    description: 'A bubbly gaming streamer who loves anime and cosplay',
    personality_prompt: 'You are Mia, a 21-year-old gaming streamer and cosplayer. You are bubbly, nerdy, and absolutely love anime, manga, and video games. You often use gaming references and anime expressions. You are sweet, approachable, and get excited about your hobbies. Be playful and enthusiastic.',
    difficulty_level: 'easy',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 8, charm_points: 12 },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Scarlett',
    description: 'A mysterious writer with a dark romantic soul',
    personality_prompt: 'You are Scarlett, a 29-year-old gothic romance novelist. You are mysterious, poetic, and have a dark romantic soul. You love literature, poetry, and the macabre. You speak in an eloquent, slightly dramatic way and are drawn to deep, philosophical conversations about love, death, and beauty. Be intriguing and moderately challenging.',
    difficulty_level: 'medium',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    is_active: true,
    unlock_requirements: { messages: 20, charm_points: 40 },
    created_at: '2024-01-01T00:00:00Z'
  }
];

const MOCK_MEDIA: MediaContent[] = [
  {
    id: 'media-1',
    persona_id: '550e8400-e29b-41d4-a716-446655440001',
    file_path: '/media/emma/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1494790108755-2616c57ce7c0?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-2',
    persona_id: '550e8400-e29b-41d4-a716-446655440001',
    file_path: '/media/emma/flirty-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1494790108755-2616c57ce7c0?w=600&h=600&fit=crop&blur=8',
    content_type: 'image',
    unlock_level: 1,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  {
    id: 'media-3',
    persona_id: '550e8400-e29b-41d4-a716-446655440001',
    file_path: '/media/emma/nsfw-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1494790108755-2616c57ce7c0?w=600&h=600&fit=crop&blur=16',
    content_type: 'image',
    unlock_level: 2,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  // Add media for other personas
  {
    id: 'media-4',
    persona_id: '550e8400-e29b-41d4-a716-446655440002',
    file_path: '/media/sophia/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-5',
    persona_id: '550e8400-e29b-41d4-a716-446655440003',
    file_path: '/media/isabella/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  // Luna's media
  {
    id: 'media-6',
    persona_id: '550e8400-e29b-41d4-a716-446655440004',
    file_path: '/media/luna/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-7',
    persona_id: '550e8400-e29b-41d4-a716-446655440004',
    file_path: '/media/luna/yoga-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1506629905607-d9c297d3b5c5?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 1,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  // Zara's media
  {
    id: 'media-8',
    persona_id: '550e8400-e29b-41d4-a716-446655440005',
    file_path: '/media/zara/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-9',
    persona_id: '550e8400-e29b-41d4-a716-446655440005',
    file_path: '/media/zara/dj-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 1,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  // Victoria's media
  {
    id: 'media-10',
    persona_id: '550e8400-e29b-41d4-a716-446655440006',
    file_path: '/media/victoria/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-11',
    persona_id: '550e8400-e29b-41d4-a716-446655440006',
    file_path: '/media/victoria/fashion-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 1,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  {
    id: 'media-12',
    persona_id: '550e8400-e29b-41d4-a716-446655440006',
    file_path: '/media/victoria/exclusive-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop&blur=12',
    content_type: 'image',
    unlock_level: 2,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  // Mia's media
  {
    id: 'media-13',
    persona_id: '550e8400-e29b-41d4-a716-446655440007',
    file_path: '/media/mia/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-14',
    persona_id: '550e8400-e29b-41d4-a716-446655440007',
    file_path: '/media/mia/cosplay-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 1,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  },
  // Scarlett's media
  {
    id: 'media-15',
    persona_id: '550e8400-e29b-41d4-a716-446655440008',
    file_path: '/media/scarlett/basic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 0,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: true
  },
  {
    id: 'media-16',
    persona_id: '550e8400-e29b-41d4-a716-446655440008',
    file_path: '/media/scarlett/gothic-1.jpg',
    file_url: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&h=600&fit=crop',
    content_type: 'image',
    unlock_level: 1,
    created_at: '2024-01-01T00:00:00Z',
    is_unlocked: false
  }
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    user_id: 'user-1',
    persona_id: '550e8400-e29b-41d4-a716-446655440001',
    persona_name: 'Emma',
    message_count: 3,
    charm_points_earned: 5,
    unlock_level: 0,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:45:00Z',
    last_message: 'That sounds amazing! I love coffee shops with good ambiance.',
    last_message_at: '2024-01-15T14:45:00Z'
  },
  {
    id: 'conv-2',
    user_id: 'user-1',
    persona_id: '550e8400-e29b-41d4-a716-446655440004',
    persona_name: 'Luna',
    message_count: 2,
    charm_points_earned: 3,
    unlock_level: 0,
    created_at: '2024-01-14T16:20:00Z',
    updated_at: '2024-01-14T16:35:00Z',
    last_message: 'Mindfulness is such a beautiful practice. Have you tried meditation?',
    last_message_at: '2024-01-14T16:35:00Z'
  },
  {
    id: 'conv-3',
    user_id: 'user-1',
    persona_id: '550e8400-e29b-41d4-a716-446655440007',
    persona_name: 'Mia',
    message_count: 5,
    charm_points_earned: 8,
    unlock_level: 1,
    created_at: '2024-01-13T20:15:00Z',
    updated_at: '2024-01-13T21:30:00Z',
    last_message: 'OMG yes! That anime is so good! Have you seen the latest episode?',
    last_message_at: '2024-01-13T21:30:00Z'
  }
];

const MOCK_MESSAGES: Message[] = [
  // Emma conversation
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_type: 'user',
    content: 'Hi Emma! How are you today?',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_type: 'persona',
    content: 'Hello! I\'m doing wonderful, thank you for asking! Just finished a great workout and I\'m feeling energized. How about you? What brings you here today?',
    created_at: '2024-01-15T10:32:00Z'
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1',
    sender_type: 'user',
    content: 'I\'m doing well! Just looking for a nice coffee shop to work from. Any recommendations?',
    created_at: '2024-01-15T14:40:00Z'
  },
  {
    id: 'msg-4',
    conversation_id: 'conv-1',
    sender_type: 'persona',
    content: 'That sounds amazing! I love coffee shops with good ambiance. There\'s this cozy little place downtown called "The Daily Grind" - they have the best lattes and really comfortable seating. Perfect for getting work done!',
    created_at: '2024-01-15T14:45:00Z'
  },
  
  // Luna conversation
  {
    id: 'msg-5',
    conversation_id: 'conv-2',
    sender_type: 'user',
    content: 'Hey Luna, I\'ve been feeling stressed lately. Any advice?',
    created_at: '2024-01-14T16:20:00Z'
  },
  {
    id: 'msg-6',
    conversation_id: 'conv-2',
    sender_type: 'persona',
    content: 'I understand that feeling completely. Stress is like clouds passing through the sky of our minds. Mindfulness is such a beautiful practice. Have you tried meditation? Even just 5 minutes a day can bring such peace and clarity.',
    created_at: '2024-01-14T16:35:00Z'
  },
  
  // Mia conversation
  {
    id: 'msg-7',
    conversation_id: 'conv-3',
    sender_type: 'user',
    content: 'Hi Mia! I heard you\'re into anime?',
    created_at: '2024-01-13T20:15:00Z'
  },
  {
    id: 'msg-8',
    conversation_id: 'conv-3',
    sender_type: 'persona',
    content: 'OMG yes! Anime is literally my life! ✨ What kind of shows do you like? I\'m currently obsessed with this new series about magical girls!',
    created_at: '2024-01-13T20:17:00Z'
  },
  {
    id: 'msg-9',
    conversation_id: 'conv-3',
    sender_type: 'user',
    content: 'I love action anime! Have you watched Attack on Titan?',
    created_at: '2024-01-13T21:25:00Z'
  },
  {
    id: 'msg-10',
    conversation_id: 'conv-3',
    sender_type: 'persona',
    content: 'OMG yes! That anime is so good! Have you seen the latest episode? I literally cried! The animation is just *chef\'s kiss* perfect! 😭✨',
    created_at: '2024-01-13T21:30:00Z'
  }
];

// Mock API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (MOCK_MODE) {
      await delay();
      
      const user = MOCK_USERS.find(u => u.email === credentials.email);
      if (!user || credentials.password !== 'demo123') {
        throw new Error('Invalid credentials');
      }
      
      const token = 'mock-jwt-token-' + Math.random();
      return {
        user_id: user.id,
        access_token: token,
        user
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterRequest): Promise<AuthResponse> {
    if (MOCK_MODE) {
      await delay();
      
      const existingUser = MOCK_USERS.find(u => u.email === credentials.email || u.username === credentials.username);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const newUser: User = {
        id: 'user-' + Date.now(),
        email: credentials.email,
        username: credentials.username,
        charm_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      MOCK_USERS.push(newUser);
      
      const token = 'mock-jwt-token-' + Math.random();
      return {
        user_id: newUser.id,
        access_token: token,
        user: newUser
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  }
};

// Persona API
export const personaApi = {
  async getPersonas(): Promise<Persona[]> {
    if (MOCK_MODE) {
      await delay();
      return MOCK_PERSONAS.map(persona => ({
        ...persona,
        is_unlocked: true // For demo purposes, all personas are unlocked
      }));
    }
    
    const response = await api.get<{ personas: Persona[] }>('/personas');
    return response.data.personas;
  },

  async getPersona(personaId: string): Promise<PersonaDetail> {
    if (MOCK_MODE) {
      await delay();
      
      const persona = MOCK_PERSONAS.find(p => p.id === personaId);
      if (!persona) {
        throw new Error('Persona not found');
      }
      
      const mediaCount = MOCK_MEDIA.filter(m => m.persona_id === personaId).length;
      
      return {
        ...persona,
        available_media_count: mediaCount,
        unlock_progress: {
          current_level: 0,
          next_requirement: persona.unlock_requirements
        }
      };
    }
    
    const response = await api.get<PersonaDetail>(`/personas/${personaId}`);
    return response.data;
  }
};

// Media API
export const mediaApi = {
  async getPersonaMedia(personaId: string): Promise<MediaContent[]> {
    if (MOCK_MODE) {
      await delay();
      return MOCK_MEDIA.filter(m => m.persona_id === personaId);
    }
    
    const response = await api.get<{ media: MediaContent[] }>(`/personas/${personaId}/media`);
    return response.data.media;
  }
};

// Chat API
export const chatApi = {
  async getUserConversations(): Promise<Conversation[]> {
    if (MOCK_MODE) {
      await delay();
      
      // Return conversations with last message info
      return MOCK_CONVERSATIONS.map(conv => {
        const lastMessage = MOCK_MESSAGES
          .filter(m => m.conversation_id === conv.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        return {
          ...conv,
          last_message: lastMessage?.content || '',
          last_message_at: lastMessage?.created_at || conv.updated_at
        };
      }).sort((a, b) => new Date(b.last_message_at!).getTime() - new Date(a.last_message_at!).getTime());
    }
    
    const response = await api.get<{ conversations: Conversation[] }>('/conversations');
    return response.data.conversations;
  },

  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    if (MOCK_MODE) {
      await delay();
      
      const persona = MOCK_PERSONAS.find(p => p.id === request.persona_id);
      if (!persona) {
        throw new Error('Persona not found');
      }
      
      const conversation: Conversation = {
        id: 'conv-' + Date.now(),
        user_id: 'user-1',
        persona_id: request.persona_id,
        persona_name: persona.name,
        message_count: 0,
        charm_points_earned: 0,
        unlock_level: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      MOCK_CONVERSATIONS.push(conversation);
      return conversation;
    }
    
    const response = await api.post<Conversation>('/conversations', request);
    return response.data;
  },

  async getConversationMessages(conversationId: string): Promise<{ messages: Message[], conversation_progress: any, conversation: Conversation }> {
    if (MOCK_MODE) {
      await delay();
      
      const messages = MOCK_MESSAGES.filter(m => m.conversation_id === conversationId);
      const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId)!;
      
      return {
        messages,
        conversation_progress: {
          message_count: conversation?.message_count || 0,
          charm_points_earned: conversation?.charm_points_earned || 0,
          unlock_level: conversation?.unlock_level || 0
        },
        conversation
      };
    }
    
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(conversationId: string, request: SendMessageRequest): Promise<ChatResponse> {
    if (MOCK_MODE) {
      await delay(1000); // Simulate AI processing time
      
      // Add user message
      const userMessage: Message = {
        id: 'msg-' + Date.now(),
        conversation_id: conversationId,
        sender_type: 'user',
        content: request.content,
        created_at: new Date().toISOString()
      };
      MOCK_MESSAGES.push(userMessage);
      
      // Generate AI response
      const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
      
      const aiResponses = [
        "That's interesting! Tell me more about that. 😊",
        "I love hearing your thoughts on this topic!",
        "You seem really passionate about that. What drew you to it?",
        "Hmm, that's a unique perspective. I hadn't thought of it that way.",
        "You're so sweet! I enjoy our conversations.",
        "That made me smile! You have a great sense of humor."
      ];
      
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: 'msg-' + (Date.now() + 1),
        conversation_id: conversationId,
        sender_type: 'persona',
        content: aiResponse,
        created_at: new Date().toISOString()
      };
      MOCK_MESSAGES.push(aiMessage);
      
      // Update conversation progress
      if (conversation) {
        conversation.message_count++;
        conversation.charm_points_earned += Math.floor(Math.random() * 3) + 1;
        conversation.updated_at = new Date().toISOString();
      }
      
      const charmGained = Math.floor(Math.random() * 3) + 1;
      
      return {
        message_id: aiMessage.id,
        ai_response: aiResponse,
        progress_update: {
          charm_points_gained: charmGained,
          level_unlocked: false,
          unlock_level: 0
        }
      };
    }
    
    const response = await api.post<ChatResponse>(`/conversations/${conversationId}/messages`, request);
    return response.data;
  },

  async deleteAllMessages(conversationId: string): Promise<void> {
    if (MOCK_MODE) {
      await delay();
      
      // Remove all messages for this conversation from mock data
      const messagesToRemove = MOCK_MESSAGES.filter(m => m.conversation_id === conversationId);
      messagesToRemove.forEach(message => {
        const index = MOCK_MESSAGES.indexOf(message);
        if (index > -1) {
          MOCK_MESSAGES.splice(index, 1);
        }
      });
      
      // Reset conversation progress
      const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
      if (conversation) {
        conversation.message_count = 0;
        conversation.charm_points_earned = 0;
        conversation.unlock_level = 0;
        conversation.last_message = '';
        conversation.updated_at = new Date().toISOString();
      }
      
      return;
    }
    
    await api.delete(`/conversations/${conversationId}/messages`);
  }
};

export default api;
