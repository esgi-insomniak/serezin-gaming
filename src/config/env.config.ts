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
        redirectUri: process.env.DISCORD_API_OAUTH_REDIRECT_URI || '',
      },
    },
    app: {
      id: process.env.DISCORD_APP_ID || '',
      secret: process.env.DISCORD_APP_SECRET || '',
    },
  },
});

export type EnvironmentVariables = ReturnType<typeof EnvironmentVariables>;
