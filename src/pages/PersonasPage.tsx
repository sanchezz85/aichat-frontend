import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { PersonaList, PersonaDetail } from '../components/personas';
import { MediaGallery } from '../components/media';
import { usePersonas, usePersona } from '../hooks/usePersonas';
import { Button, Input } from '../components/ui';
import { DifficultyLevel } from '../types';

const PersonasPage: React.FC = () => {
  const { personaId, tab } = useParams<{ personaId?: string; tab?: string }>();

  if (personaId) {
    return <PersonaDetailPage personaId={personaId} activeTab={tab} />;
  }

  return <PersonaListPage />;
};

const PersonaListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'newest'>('name');

  const { data: personas = [], isLoading, error } = usePersonas();

  // Filter and sort personas
  const filteredPersonas = personas
    .filter(persona => {
      const matchesSearch = persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          persona.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || persona.difficulty_level === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty_level] - difficultyOrder[b.difficulty_level];
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          AI Personas
        </h1>
        <p className="text-text-secondary">
          Discover and connect with unique AI personalities, each with their own stories to tell.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
            <Input
              type="text"
              placeholder="Search personas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 bg-bg-elev-1 border border-gray-600 rounded-lg text-text-primary focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="difficulty">Sort by Difficulty</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-text-secondary py-2">Filter by difficulty:</span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setDifficultyFilter(difficulty)}
              className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                difficultyFilter === difficulty
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
              }`}
            >
              {difficulty}
              {difficulty !== 'all' && (
                <span className="ml-1 opacity-60">
                  ({personas.filter(p => p.difficulty_level === difficulty).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-text-secondary">
          Showing {filteredPersonas.length} of {personas.length} personas
        </p>
      </div>

      {/* Personas Grid */}
      <PersonaList 
        personas={filteredPersonas}
        loading={isLoading}
        error={error}
        layout="grid"
      />
    </div>
  );
};

const PersonaDetailPage: React.FC<{ personaId: string; activeTab?: string }> = ({ 
  personaId, 
  activeTab = 'profile' 
}) => {
  const [currentTab, setCurrentTab] = useState<'profile' | 'media'>(
    activeTab as 'profile' | 'media' || 'profile'
  );

  const { data: persona, isLoading, error } = usePersona(personaId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="bg-gray-700 h-8 w-48 rounded mb-4"></div>
          <div className="bg-gray-700 h-32 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !persona) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-400 mb-4">Persona not found</p>
        <Button variant="secondary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-8 border-b border-gray-700">
          <button
            onClick={() => setCurrentTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentTab === 'profile'
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setCurrentTab('media')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentTab === 'media'
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Media
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === 'profile' ? (
        <PersonaDetail persona={persona} />
      ) : (
        <MediaGallery personaId={personaId} personaName={persona.name} />
      )}
    </div>
  );
};

export default PersonasPage;

