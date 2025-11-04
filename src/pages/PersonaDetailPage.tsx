import React from 'react';
import { useParams } from 'react-router-dom';
import { PersonaDetail } from '../components/personas';
import { usePersona } from '../hooks/usePersonas';
import { Button } from '../components/ui';

const PersonaDetailPage: React.FC = () => {
  const { personaId } = useParams<{ personaId: string }>();

  const { data: persona, isLoading, error } = usePersona(personaId!);

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
      <PersonaDetail persona={persona} />
    </div>
  );
};

export default PersonaDetailPage;

