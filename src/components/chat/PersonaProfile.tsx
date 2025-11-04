import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Briefcase, User } from 'lucide-react';
import { Avatar, Badge } from '../ui';
import { MediaGallery } from '../media';
import { resolveAssetUrl } from '../../config/api';
import { PersonaDetail } from '../../types';

interface PersonaProfileProps {
  persona: PersonaDetail | null;
  loading?: boolean;
}

const PersonaProfile: React.FC<PersonaProfileProps> = ({ persona, loading = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'gallery'>('about');

  const handleAvatarClick = () => {
    if (persona) {
      navigate(`/personas/${persona.id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-[30rem] bg-bg-secondary border-l border-gray-700 h-full chat-scrollable">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-600 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="w-[30rem] bg-bg-secondary border-l border-gray-700 h-full chat-scrollable">
        <div className="p-6">
          <div className="text-center text-text-secondary">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={32} />
            </div>
            <p className="text-sm">Select a conversation to view persona profile</p>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder meta values until extended profile fields are provided by backend
  const personaDetails = {
    age: undefined as number | undefined,
    location: undefined as string | undefined,
    occupation: undefined as string | undefined,
    interests: [] as string[]
  };


  return (
    <div className="w-[30rem] bg-bg-secondary border-l border-gray-700 h-full chat-scrollable">
      {/* Header with persona image and basic info */}
      <div className="p-6 border-b border-gray-700">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <button
              onClick={handleAvatarClick}
              className="focus:outline-none focus:ring-2 focus:ring-accent rounded-full transition-opacity hover:opacity-80 cursor-pointer"
            >
              <Avatar
                src={resolveAssetUrl(persona.avatar_url)}
                alt={persona.name}
                size="xl"
                fallback={persona.name}
              />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-2">{persona.name}</h2>
          
          
          <p className="text-sm text-text-secondary leading-relaxed">
            {persona.description}
          </p>
        </div>

      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'about'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'gallery'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Gallery
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'about' ? (
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              {persona.interests && (
                <div className="space-y-2">
                  <p className="text-text-primary">{persona.interests}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <MediaGallery 
              personaId={persona.id}
              personaName={persona.name}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaProfile;
