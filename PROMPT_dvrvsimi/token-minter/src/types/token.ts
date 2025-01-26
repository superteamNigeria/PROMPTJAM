export interface Token {
    id: string;
    value: string;
    amount: number;
    timestamp: number;
    metadata?: TokenMetadata;
  }
  
  export interface TokenMetadata {
    name?: string;
    description?: string;
    image?: string;
  }
  
  export type MintStatus = 'idle' | 'minting' | 'success' | 'error';