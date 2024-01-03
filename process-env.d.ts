declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MNEMONIC: string;
      COLLECTION_SYMBOL: string;
    }
  }
}

export {};
