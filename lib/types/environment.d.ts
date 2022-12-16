declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OG_SECRET: string;
    }
  }
}

export {};
