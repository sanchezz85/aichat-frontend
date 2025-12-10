export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  WS_URL: 'ws://localhost:8080',
  MEDIA_BASE_URL: 'http://localhost:8080/media'
};

// Resolve absolute URL for assets coming from backend or public folder
// - If url is absolute (http/https), return as-is
// - If url starts with /media, point to backend media host
// - Otherwise, return as-is (let caller decide)
export const resolveAssetUrl = (url?: string, bustCache: boolean = false): string => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  if (url.startsWith('/media/')) {
    // Ensure we don't double up the /media prefix
    const path = url.replace(/^\/media\/?/i, '');
    let fullUrl = `${API_CONFIG.MEDIA_BASE_URL}/${path}`;
    
    // Add cache-busting parameter for avatars if requested
    if (bustCache && url.includes('/avatar/')) {
      const timestamp = Date.now();
      fullUrl += `?v=${timestamp}`;
    }
    
    return fullUrl;
  }

  return url;
};

// Generate avatar URL for a persona by name
// Avatar path structure: /media/<persona_name>/avatar/<persona_name>.jpg
export const getPersonaAvatarUrl = (personaName: string): string => {
  const name = personaName.toLowerCase();
  return `${API_CONFIG.MEDIA_BASE_URL}/${name}/avatar/${name}.jpg`;
};
