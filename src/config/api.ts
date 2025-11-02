export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  WS_URL: 'ws://localhost:8080',
  MEDIA_BASE_URL: 'http://localhost:8080/media'
};

// Resolve absolute URL for assets coming from backend or public folder
// - If url is absolute (http/https), return as-is
// - If url starts with /media, point to backend media host
// - If url starts with /avatars, serve from frontend public folder
// - Otherwise, return as-is (let caller decide)
export const resolveAssetUrl = (url?: string): string => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  if (url.startsWith('/media/')) {
    // Ensure we don't double up the /media prefix
    const path = url.replace(/^\/media\/?/i, '');
    return `${API_CONFIG.MEDIA_BASE_URL}/${path}`;
  }

  // Map legacy /avatars/* to backend media path for consistency
  if (url.startsWith('/avatars/')) {
    const filename = url.replace(/^\/avatars\//i, '');
    return `${API_CONFIG.MEDIA_BASE_URL}/avatars/${filename}`;
  }

  return url;
};
