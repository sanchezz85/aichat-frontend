import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button } from '../ui';
import { Persona } from '../../types';
import { chatApi } from '../../services/api';
import { resolveAssetUrl } from '../../config/api';

interface PersonaCardProps {
  persona: Persona;
  compact?: boolean;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ 
  persona, 
  compact = false 
}) => {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = React.useState(false);

  const startChat = async () => {
    try {
      setIsStartingChat(true);
      const conversation = await chatApi.createConversation({ 
        persona_id: persona.id 
      });
      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  const viewProfile = () => {
    navigate(`/personas/${persona.id}`);
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-bg-elev-1 hover:bg-gray-800 transition-colors">
        <Avatar
          src={resolveAssetUrl(persona.avatar_url)}
          alt={persona.name}
          size="md"
          fallback={persona.name}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate">
            {persona.name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            {persona.description}
          </p>
        </div>
        <Badge 
          variant="difficulty" 
          difficulty={persona.difficulty_level}
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-elev-1 rounded-xl overflow-hidden shadow-1 hover:shadow-2 transition-all duration-200 hover:-translate-y-1">
      {/* Avatar/Image Section */}
      <div className="relative aspect-square">
        <img
          src={resolveAssetUrl(persona.avatar_url)}
          alt={persona.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Difficulty badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant="difficulty" 
            difficulty={persona.difficulty_level}
          />
        </div>
        
        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-semibold text-white mb-1">
            {persona.name}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {persona.description}
        </p>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={viewProfile}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={startChat}
            loading={isStartingChat}
            disabled={isStartingChat}
            className="flex-1"
          >
            Chat Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonaCard;

