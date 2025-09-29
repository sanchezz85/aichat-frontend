export type SenderType = 'user' | 'persona';

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  persona_id: string;
  persona_name: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
}

// Gamification removed

// Gamification removed

export interface ChatResponse {
  message_id: string;
  ai_response: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'user_message' | 'persona_response' | 'typing_indicator' | 'system_message';
  content?: string;
  typing_complete?: boolean;
  is_typing?: boolean;
}

export interface CreateConversationRequest {
  persona_id: string;
}

export interface SendMessageRequest {
  content: string;
}

