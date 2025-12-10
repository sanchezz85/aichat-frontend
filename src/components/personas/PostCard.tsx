import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import { Avatar, ImageLightbox } from '../ui';
import { Post } from '../../types';
import { resolveAssetUrl } from '../../config/api';
import { chatApi } from '../../services/api';
import type { LightboxImage } from '../ui/ImageLightbox';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.liked_by_user || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id);
  };

  const handleChat = async () => {
    try {
      setIsStartingChat(true);
      const conversation = await chatApi.createConversation({ 
        persona_id: post.persona.id 
      });
      navigate('/chat', { state: { selectedConversationId: conversation.id } });
    } catch (error) {
      console.error('Failed to start chat:', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleProfileClick = () => {
    navigate(`/personas/${post.persona.id}`);
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Prepare images for lightbox
  const lightboxImages: LightboxImage[] = post.media?.map((media) => ({
    url: resolveAssetUrl(media.file_url),
    alt: 'Post content'
  })) || [];

  return (
    <article className="bg-bg-elev-1 rounded-xl overflow-hidden border border-white/[0.08] mb-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleProfileClick}
            className="focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full"
            aria-label={`View ${post.persona.name}'s profile`}
          >
            <Avatar
              src={resolveAssetUrl(post.persona.avatar_url)}
              alt={post.persona.name}
              size="16"
              fallback={post.persona.name}
            />
          </button>
          <div>
            <button 
              onClick={handleProfileClick}
              className="focus:outline-none hover:underline"
            >
              <h3 className="font-semibold text-text-primary text-base cursor-pointer">
                {post.persona.name}
              </h3>
            </button>
            <p className="text-text-secondary text-sm -mt-0.5">{post.persona.username}</p>
          </div>
        </div>
        <div className="text-text-tertiary text-sm">
          {formatDate(post.created_at)}
        </div>
      </div>

      {/* Text Content */}
      {post.text && (
        <div className="px-4 pb-3">
          <p className="text-text-primary text-base leading-snug">
            {post.text}
          </p>
        </div>
      )}

      {/* Media Content */}
      {post.media && post.media.length > 0 && (
        <div className="relative">
          {post.media.length === 1 ? (
            <img
              src={resolveAssetUrl(post.media[0].file_url)}
              alt="Post content"
              className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              style={{ maxHeight: '600px' }}
              onClick={() => handleImageClick(0)}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.media.slice(0, 4).map((media, index) => (
                <div key={media.id} className="relative aspect-square">
                  <img
                    src={resolveAssetUrl(media.file_url)}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  />
                  {index === 3 && post.media.length > 4 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-none">
                      <span className="text-white text-2xl font-semibold">
                        +{post.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-6 p-4">
        <button
          onClick={handleLike}
          className="flex flex-col items-center group transition-transform duration-120 hover:scale-110"
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          <Heart
            className={`w-3 h-3 transition-colors duration-120 ${
              isLiked
                ? 'fill-accent-500 text-accent-500'
                : 'text-text-secondary group-hover:text-accent-500'
            }`}
          />
          <span className={`text-sm mt-1 ${
            isLiked ? 'text-accent-500' : 'text-text-secondary'
          }`}>
            {likeCount}
          </span>
        </button>

        <button
          onClick={handleChat}
          disabled={isStartingChat}
          className="flex flex-col items-center group transition-transform duration-120 hover:scale-110 disabled:opacity-50"
          aria-label="Start chat"
        >
          <MessageCircle
            className="w-3 h-3 text-text-secondary group-hover:text-brand-500 transition-colors duration-120"
          />
          <span className="text-sm mt-1 text-text-secondary group-hover:text-brand-500 transition-colors duration-120">
            Chat
          </span>
        </button>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </article>
  );
};

export default PostCard;

