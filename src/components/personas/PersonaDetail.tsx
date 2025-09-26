import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Image, Lock } from 'lucide-react';
import { Avatar, Badge, Button, ProgressBar } from '../ui';
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

  const { current_level, next_requirement } = persona.unlock_progress;
  const progressPercentage = (current_level / 3) * 100; // 3 levels total (0, 1, 2)

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
              <Badge 
                variant="difficulty" 
                difficulty={persona.difficulty_level}
              />
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

      {/* Progress Section */}
      <div className="bg-bg-elev-1 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Unlock Progress
        </h2>
        
        <div className="space-y-4">
          <ProgressBar
            value={current_level}
            max={3}
            label={`Level ${current_level} of 3`}
            color="accent"
            showValue
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className={`p-3 rounded-lg ${current_level >= 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center mb-1">
                {current_level >= 1 ? (
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                ) : (
                  <Lock className="w-3 h-3 mr-2" />
                )}
                <span className="font-medium">Basic Content</span>
              </div>
              <p className="text-xs opacity-80">General conversations</p>
            </div>
            
            <div className={`p-3 rounded-lg ${current_level >= 2 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center mb-1">
                {current_level >= 2 ? (
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                ) : (
                  <Lock className="w-3 h-3 mr-2" />
                )}
                <span className="font-medium">Flirty Content</span>
              </div>
              <p className="text-xs opacity-80">Romantic conversations</p>
            </div>
            
            <div className={`p-3 rounded-lg ${current_level >= 3 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              <div className="flex items-center mb-1">
                {current_level >= 3 ? (
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                ) : (
                  <Lock className="w-3 h-3 mr-2" />
                )}
                <span className="font-medium">Intimate Content</span>
              </div>
              <p className="text-xs opacity-80">Premium content</p>
            </div>
          </div>
          
          {current_level < 3 && (
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4">
              <h3 className="font-medium text-brand-400 mb-2">
                Next Unlock Requirements
              </h3>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>
                  💬 {next_requirement.messages} messages
                </span>
                <span>
                  ✨ {next_requirement.charm_points} charm points
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personality Info */}
      <div className="bg-bg-elev-1 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          About {persona.name}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-text-primary mb-2">Difficulty</h3>
            <div className="flex items-center">
              <Badge 
                variant="difficulty" 
                difficulty={persona.difficulty_level}
              />
              <span className="text-sm text-text-secondary ml-2">
                {persona.difficulty_level === 'easy' && 'Easy to charm'}
                {persona.difficulty_level === 'medium' && 'Moderately challenging'}
                {persona.difficulty_level === 'hard' && 'Very challenging'}
              </span>
            </div>
          </div>
          
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

