// Re-export all types for easier imports
export * from './auth';
export * from './persona';
export * from './chat';

// Common utility types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// UI component common props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Loading and error states
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// Route params
export interface ChatRouteParams {
  conversationId: string;
}

export interface PersonaRouteParams {
  personaId: string;
}

