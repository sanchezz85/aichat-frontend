// Difficulty removed

// Unlock requirements removed

export interface Persona {
  id: string;
  name: string;
  description: string;
  personality_prompt: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
}

export interface PersonaDetail extends Persona {
  available_media_count: number;
}

export interface MediaContent {
  id: string;
  persona_id: string;
  file_path: string;
  file_url: string;
  content_type: 'image' | 'video';
  created_at: string;
}

