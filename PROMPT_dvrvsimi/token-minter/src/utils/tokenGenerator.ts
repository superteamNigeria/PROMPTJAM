import { Token } from '../types/token';

export const generateToken = (amount: number): Token => {
  const tokenValue = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
  
  return {
    id: crypto.randomUUID(),
    value: tokenValue,
    amount,
    timestamp: Date.now()
  };
};

export const validateMintAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 100; // Example validation
};