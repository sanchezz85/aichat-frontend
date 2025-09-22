import React from 'react';
import { Loader2 } from 'lucide-react';
import PersonaCard from './PersonaCard';
import { Persona } from '../../types';

interface PersonaListProps {
  personas: Persona[];
  loading?: boolean;
  error?: Error | null;
  layout?: 'grid' | 'list';
  compact?: boolean;
}

const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  loading = false,
  error = null,
  layout = 'grid',
  compact = false
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading personas...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <p className="text-lg font-medium">Failed to load personas</p>
          <p className="text-sm text-red-400/80">{error.message}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-brand-400 hover:text-brand-300 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (personas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary">
          <p className="text-lg font-medium mb-2">No personas available</p>
          <p className="text-sm">Check back later for new AI personas to chat with.</p>
        </div>
      </div>
    );
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            compact={compact}
          />
        ))}
      </div>
    );
  }

  // List layout
  return (
    <div className="space-y-3">
      {personas.map((persona) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          compact={true}
        />
      ))}
    </div>
  );
};

export default PersonaList;

