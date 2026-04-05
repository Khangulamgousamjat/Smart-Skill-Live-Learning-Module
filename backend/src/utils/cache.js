import redisClient from '../config/redis.js';

const IN_MEMORY_CACHE = new Map();
const DEFAULT_TTL = 300; // 5 minutes in seconds

/**
 * Universal caching utility
 * @param {string} key - Cache identifier
 * @param {Function} fetchFunc - Function to fetch data if cache misses
 * @param {number} ttl - Time to live in seconds
 */
export const getOrSetCache = async (key, fetchFunc, ttl = DEFAULT_TTL) => {
  // 1. Try Redis if available
  if (redisClient) {
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.warn(`Redis cache get error for key [${key}]:`, err.message);
    }
  }

  // 2. Try In-Memory Fallback
  const memoryEntry = IN_MEMORY_CACHE.get(key);
  if (memoryEntry && memoryEntry.expiry > Date.now()) {
    return memoryEntry.data;
  }

  // 3. Fetch fresh data
  const data = await fetchFunc();

  // 4. Update Redis
  if (redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (err) {
      console.warn(`Redis cache set error for key [${key}]:`, err.message);
    }
  }

  // 5. Update In-Memory Fallback
  IN_MEMORY_CACHE.set(key, {
    data,
    expiry: Date.now() + ttl * 1000
  });

  return data;
};

/**
 * Clear cache for a specific key
 */
export const clearCache = async (key) => {
  if (redisClient) {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn(`Redis cache del error for key [${key}]:`, err.message);
    }
  }
  IN_MEMORY_CACHE.delete(key);
};
