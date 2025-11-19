/**
 * Simple in-memory cache with TTL (Time To Live)
 * Cache duration: 5 minutes
 */

class Cache {
  constructor(ttlMinutes = 5) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Generate cache key from module and search term
   */
  generateKey(module, searchTerm, limit = 10) {
    return `${module}:${searchTerm.toLowerCase()}:${limit}`;
  }

  /**
   * Get cached data if it exists and is not expired
   */
  get(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Return cached data with cache metadata
    return {
      ...cached.data,
      _cached: true,
      _cached_at: cached.timestamp,
      _expires_at: cached.expiry
    };
  }

  /**
   * Store data in cache with expiry
   */
  set(key, data) {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + this.ttl
    });
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let activeCount = 0;
    let expiredCount = 0;

    this.cache.forEach((value) => {
      if (now > value.expiry) {
        expiredCount++;
      } else {
        activeCount++;
      }
    });

    return {
      total: this.cache.size,
      active: activeCount,
      expired: expiredCount,
      ttl_minutes: this.ttl / 60000
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    this.cache.forEach((value, key) => {
      if (now > value.expiry) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));

    return keysToDelete.length;
  }
}

// Create singleton instance with 5-minute TTL
const cache = new Cache(5);

// Auto-cleanup every 10 minutes
setInterval(() => {
  const cleaned = cache.cleanup();
  if (cleaned > 0) {
    console.log(`Cache cleanup: removed ${cleaned} expired entries`);
  }
}, 10 * 60 * 1000);

module.exports = cache;
