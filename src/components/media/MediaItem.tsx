import React, { useState } from 'react';
import { Play, Eye, Lock } from 'lucide-react';
import { Button } from '../ui';
import { MediaContent } from '../../types';
import { resolveAssetUrl } from '../../config/api';

interface MediaItemProps {
  media: MediaContent;
  onView?: (media: MediaContent) => void;
  isLocked?: boolean;
  className?: string;
}

const MediaItem: React.FC<MediaItemProps> = ({
  media,
  onView,
  isLocked = false,
  className
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleView = () => {
    if (!isLocked) {
      onView?.(media);
    }
  };

  return (
    <div className={`relative group ${isLocked ? 'cursor-default' : 'cursor-pointer'} ${className}`} onClick={handleView}>
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
        {isLocked ? (
          // Locked placeholder
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-text-tertiary">
              <div className="bg-gray-700/50 rounded-full p-4 inline-block mb-3">
                <Lock className="w-10 h-10" />
              </div>
              <p className="text-sm font-medium">Locked</p>
              <p className="text-xs mt-1 px-4">Follow to unlock</p>
            </div>
          </div>
        ) : (
          <>
            {/* Media content */}
            {!imageError ? (
              <>
                <img
                  src={resolveAssetUrl(media.file_url)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MediaItem;

