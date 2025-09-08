import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cache for storing client instances by token
const clientCache = new Map();

export const getSupabaseClient = (token) => {
  // Create cache key - use 'anonymous' for requests without token
  const cacheKey = token || 'anonymous';
  
  // Return cached client if it exists
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey);
  }
  
  // Create new client with appropriate config
  const clientConfig = token 
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}; // Use default config for anonymous requests
  
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientConfig);
  
  // Cache the client
  clientCache.set(cacheKey, client);
  
  return client;
};

// Function to clear cached clients (useful for logout or token refresh)
export const clearSupabaseCache = () => {
  clientCache.clear();
};

// Function to clear specific token from cache
export const clearSupabaseToken = (token) => {
  const cacheKey = token || 'anonymous';
  clientCache.delete(cacheKey);
};
