// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()

// Cache expiration time in milliseconds (default: 5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000

export function getCachedData<T>(key: string): T | null {
  const cachedItem = cache.get(key)

  if (!cachedItem) {
    return null
  }

  // Check if cache has expired
  if (Date.now() - cachedItem.timestamp > CACHE_EXPIRATION) {
    cache.delete(key)
    return null
  }

  return cachedItem.data as T
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  })
}

export function clearCache(): void {
  cache.clear()
}

export function removeCachedItem(key: string): void {
  cache.delete(key)
}

// Generate a cache key from an object
export function generateCacheKey(obj: any): string {
  return JSON.stringify(obj)
}
