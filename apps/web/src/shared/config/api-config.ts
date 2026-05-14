export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api/v1',
  AI_BASE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
} as const
