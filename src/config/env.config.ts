import { OAuth2Scopes } from 'discord-api-types/v10';

export const EnvironmentVariables = () => ({
  port: parseInt(process.env.APP_PORT) || 3000,
  ssl: {
    keyPath: process.env.SSL_PRIVATE_KEY_PATH || '',
    certPath: process.env.SSL_CERTIFICATE_PATH || '',
  },
  cors: {
    allowOrigin: process.env.CORS_ALLOW_ORIGIN || '',
  },
  riot: {
    apiKey: process.env.RIOT_API_KEY || '',
  },
  discord: {
    api: {
      oauth2: {
        backendRedirectUri:
          process.env.DISCORD_API_OAUTH_BACKEND_REDIRECT_URI || '',
        frontendRedirectUri:
          process.env.DISCORD_API_OAUTH_FRONTEND_REDIRECT_URI || '',
      },
    },
    app: {
      id: process.env.DISCORD_APP_ID || '',
      secret: process.env.DISCORD_APP_SECRET || '',
      scopes: (process.env.DISCORD_APP_SCOPES.split(',') ||
        []) as OAuth2Scopes[],
    },
  },
});

export type EnvironmentVariables = ReturnType<typeof EnvironmentVariables>;
