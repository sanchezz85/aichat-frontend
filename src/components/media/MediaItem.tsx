import React, { useState } from 'react';
import { Play, Eye } from 'lucide-react';
import { Button } from '../ui';
import { MediaContent } from '../../types';

interface MediaItemProps {
  media: MediaContent;
  onView?: (media: MediaContent) => void;
  onUnlock?: (media: MediaContent) => void;
  className?: string;
}

const MediaItem: React.FC<MediaItemProps> = ({
  media,
  onView,
  onUnlock,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleView = () => {
    onView?.(media);
  };

  const getLevelBadge = (level: number) => {
    const levels = {
      0: { label: 'Basic', variant: 'status' as const, status: 'unlocked' as const },
      1: { label: 'Flirty', variant: 'status' as const, status: 'new' as const },
      2: { label: 'Intimate', variant: 'status' as const, status: 'trending' as const }
    };
    
    const config = levels[level as keyof typeof levels] || levels[0];
    return (
      <Badge variant={config.variant} status={config.status} size="sm">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className={`relative group cursor-pointer ${className}`} onClick={handleView}>
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
        {/* Media content */}
        {!imageError ? (
          <>
            <img
              src={media.file_url}
              alt="Media content"
              className={`w-full h-full object-cover transition-all duration-200 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
            />
            
            {/* Video play icon */}
            {media.content_type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded-full p-3">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </>
        ) : (
          // Error placeholder
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-text-tertiary">
              <Eye className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs">Image not available</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !imageError && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        )}

        {/* Lock overlay removed */}

        {/* Level badge removed */}

        {/* View/Unlock button overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="primary" className="pointer-events-auto">
            <>
              <Eye className="w-4 h-4 mr-1" />
              View
            </>
          </Button>
        </div>
      </div>

      {/* Media info */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary capitalize">
            {media.content_type}
          </span>
          
        </div>
      </div>
    </div>
  );
};

export default MediaItem;

