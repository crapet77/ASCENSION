declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_COINGECKO_API_KEY?: string;
    }
  }
}

export {};
