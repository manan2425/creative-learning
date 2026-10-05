// High-performance server-side in-memory cache to prevent repeated MongoDB Atlas roundtrips

interface CacheEntry {
  data: any;
  expiresAt: number;
}

interface ImageCacheEntry {
  buffer: Buffer;
  mimeType: string;
  etag: string;
}

// Global cache objects to persist across request executions in Node.js
declare global {
  // eslint-disable-next-line no-var
  var _apiServerCache: Map<string, CacheEntry> | undefined;
  // eslint-disable-next-line no-var
  var _imageServerCache: Map<string, ImageCacheEntry> | undefined;
}

const apiCache: Map<string, CacheEntry> = global._apiServerCache || new Map();
if (!global._apiServerCache) global._apiServerCache = apiCache;

const imageCache: Map<string, ImageCacheEntry> = global._imageServerCache || new Map();
if (!global._imageServerCache) global._imageServerCache = imageCache;

// Maximum number of cached images in RAM to prevent memory issues
const MAX_IMAGE_CACHE_SIZE = 300;

export function getCachedApiResponse<T = any>(key: string): T | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    apiCache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCachedApiResponse(key: string, data: any, ttlSeconds: number = 60): void {
  apiCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function invalidateApiCache(prefix?: string): void {
  if (!prefix) {
    apiCache.clear();
    return;
  }
  Array.from(apiCache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      apiCache.delete(key);
    }
  });
}

export function getCachedImage(id: string): ImageCacheEntry | null {
  return imageCache.get(id) || null;
}

export function setCachedImage(id: string, buffer: Buffer, mimeType: string, etag: string): void {
  // Simple FIFO eviction if cache size grows too large
  if (imageCache.size >= MAX_IMAGE_CACHE_SIZE) {
    const keys = Array.from(imageCache.keys());
    if (keys.length > 0) imageCache.delete(keys[0]);
  }
  imageCache.set(id, { buffer, mimeType, etag });
}

export function invalidateCachedImage(id?: string): void {
  if (id) {
    imageCache.delete(id);
  } else {
    imageCache.clear();
  }
}
