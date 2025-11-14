import React, { useState, useEffect } from 'react';

interface AvatarCache {
  [username: string]: {
    url: string;
    timestamp: number;
    expiresAt: number;
  };
}

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: number;
}

class AvatarService {
  private cache: AvatarCache = {};
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000;
  private readonly PROXY_ENDPOINTS = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
  ];

  loadCache(): void {
    try {
      const cached = localStorage.getItem('avatarCache');
      if (cached) {
        this.cache = JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Ошибка загрузки кэша аватарок:', error);
    }
  }

  saveCache(): void {
    try {
      localStorage.setItem('avatarCache', JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Ошибка сохранения кэша аватарок:', error);
    }
  }

  async getAvatarUrl(username: string, size: number = 160): Promise<string> {
    const cleanUsername = username.replace('@', '');
    const cacheKey = `${cleanUsername}_${size}`;
    
    const cached = this.cache[cacheKey];
    if (cached && cached.expiresAt > Date.now()) {
      return cached.url;
    }

    try {
      const avatarUrl = await this.fetchTelegramAvatar(cleanUsername, size);
      
      this.cache[cacheKey] = {
        url: avatarUrl,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      };
      
      this.saveCache();
      return avatarUrl;
    } catch (error) {
      console.warn(`Не удалось загрузить аватар для @${cleanUsername}:`, error);
      
      const fallbackUrl = this.getFallbackAvatar(cleanUsername, size);
      
      this.cache[cacheKey] = {
        url: fallbackUrl,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION
      };
      
      this.saveCache();
      return fallbackUrl;
    }
  }

  private async fetchTelegramAvatar(username: string, _size: number): Promise<string> {
    const directUrl = `https://t.me/${username}`;
    
    try {
      const proxyUrl = `${this.PROXY_ENDPOINTS[0]}${encodeURIComponent(directUrl)}`;
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось получить страницу профиля');
      }

      const html = await response.text();
      
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
      const tgImageMatch = html.match(/https:\/\/cdn\d+\.telesco\.pe\/file\/[^"'\s]+/);
      
      if (ogImageMatch && ogImageMatch[1]) {
        return ogImageMatch[1];
      }
      
      if (tgImageMatch && tgImageMatch[0]) {
        return tgImageMatch[0];
      }

      throw new Error('Аватарка не найдена в HTML');
    } catch (error) {
      try {
        const proxyUrl2 = `${this.PROXY_ENDPOINTS[1]}${encodeURIComponent(directUrl)}`;
        const response2 = await fetch(proxyUrl2);
        const html2 = await response2.text();
        
        const ogImageMatch = html2.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImageMatch && ogImageMatch[1]) {
          return ogImageMatch[1];
        }
      } catch (e) {
      }
      
      throw error;
    }
  }

  getFallbackAvatar(username: string, size: number = 160): string {
    const hash = this.generateNameHash(username);
    const hue = hash % 360;
    const firstLetter = username.charAt(0).toUpperCase();
    const fontSize = Math.max(32, size * 0.45);
    
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(${hue}, 75%, 55%);stop-opacity:1" />
            <stop offset="50%" style="stop-color:hsl(${(hue + 30) % 360}, 75%, 60%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(${(hue + 60) % 360}, 75%, 50%);stop-opacity:1" />
          </linearGradient>
          <filter id="shadow-${hash}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#grad-${hash})" filter="url(#shadow-${hash})"/>
        <text 
          x="${size/2}" 
          y="${size/2 + fontSize/3.2}" 
          font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
          font-size="${fontSize}" 
          font-weight="600" 
          text-anchor="middle" 
          fill="white"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);"
        >${firstLetter}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  private generateNameHash(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

const avatarService = new AvatarService();
avatarService.loadCache();

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className = '',
  size = 160
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      try {
        setLoading(true);
        
        if (src.startsWith('@') || !src.includes('://')) {
          const avatarUrl = await avatarService.getAvatarUrl(src, size);
          if (mounted) {
            setImageSrc(avatarUrl);
            setLoading(false);
          }
        } else {
          if (mounted) {
            setImageSrc(src);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки аватара:', err);
        if (mounted) {
          const fallback = avatarService.getFallbackAvatar(alt || src || 'U', size);
          setImageSrc(fallback);
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [src, size, alt]);

  const handleImageError = () => {
    const fallback = avatarService.getFallbackAvatar(alt || src || 'U', size);
    setImageSrc(fallback);
  };

  if (loading) {
    return (
      <div
        className={`${className} animate-pulse bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center`}
        style={{ width: size, height: size }}
      >
        <div className="w-1/3 h-1/3 border-3 border-white/50 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} rounded-full object-cover transition-all duration-300`}
      style={{ width: size, height: size }}
      onError={handleImageError}
      loading="lazy"
      decoding="async"
    />
  );
};

export { avatarService };
export type { AvatarImageProps };
