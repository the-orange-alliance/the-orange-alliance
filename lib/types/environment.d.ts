declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL?: string;
      INTERNAL_API_URL?: string;
      OG_SECRET: string;
    }
  }
}

export {};
