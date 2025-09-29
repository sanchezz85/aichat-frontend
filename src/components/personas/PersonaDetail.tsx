import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Image } from 'lucide-react';
import { Avatar, Button } from '../ui';
import { PersonaDetail as PersonaDetailType } from '../../types';
import { chatApi } from '../../services/api';
import { resolveAssetUrl } from '../../config/api';

interface PersonaDetailProps {
  persona: PersonaDetailType;
}

const PersonaDetail: React.FC<PersonaDetailProps> = ({ persona }) => {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = React.useState(false);

  const startChat = async () => {
    try {
      setIsStartingChat(true);
      const conversation = await chatApi.createConversation({ 
        persona_id: persona.id 
      });
      // Navigate to the new three-column chat layout with this conversation
      navigate('/chat', { state: { selectedConversationId: conversation.id } });
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  const viewMedia = () => {
    navigate(`/personas/${persona.id}/media`);
  };

  // Gamification progress removed

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-bg-elev-1 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-4">
          <Avatar
            src={resolveAssetUrl(persona.avatar_url)}
            alt={persona.name}
            size="xl"
            fallback={persona.name}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">
                {persona.name}
              </h1>
            </div>
            
            <p className="text-text-secondary mb-4">
              {persona.description}
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={startChat}
                loading={isStartingChat}
                disabled={isStartingChat}
                className="flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
              
              <Button
                variant="secondary"
                onClick={viewMedia}
                className="flex items-center"
              >
                <Image className="w-4 h-4 mr-2" />
                Media ({persona.available_media_count})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section removed */}

      {/* Personality Info */}
      <div className="bg-bg-elev-1 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          About {persona.name}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          
          <div>
            <h3 className="font-medium text-text-primary mb-2">Media Available</h3>
            <p className="text-text-secondary">
              {persona.available_media_count} photos and videos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetail;

