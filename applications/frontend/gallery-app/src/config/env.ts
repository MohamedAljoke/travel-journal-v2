export const env = {
  cognito: {
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    endpoint: import.meta.env.VITE_COGNITO_ENDPOINT,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  },
} as const;