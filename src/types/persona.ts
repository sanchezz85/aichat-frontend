export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface UnlockRequirements {
  messages: number;
  charm_points: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  personality_prompt: string;
  difficulty_level: DifficultyLevel;
  avatar_url: string;
  is_active: boolean;
  unlock_requirements: UnlockRequirements;
  created_at: string;
  is_unlocked?: boolean;
}

export interface PersonaDetail extends Persona {
  available_media_count: number;
  unlock_progress: {
    current_level: number;
    next_requirement: UnlockRequirements;
  };
}

export interface MediaContent {
  id: string;
  persona_id: string;
  file_path: string;
  file_url: string;
  content_type: 'image' | 'video';
  unlock_level: number;
  created_at: string;
  is_unlocked: boolean;
}

