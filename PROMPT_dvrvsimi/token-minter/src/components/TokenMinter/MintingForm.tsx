import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MintStatus } from '../../types/token';

interface MintingFormProps {
  onMint: (amount: number) => Promise<void>;
  status: MintStatus;
}

export const MintingForm: React.FC<MintingFormProps> = ({ onMint, status }) => {
  const [amount, setAmount] = useState('1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onMint(Number(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={status === 'minting'}
      />
      <Button 
        type="submit"
        disabled={status === 'minting'}
      >
        {status === 'minting' ? 'Minting...' : 'Mint Token'}
      </Button>
    </form>
  );
};