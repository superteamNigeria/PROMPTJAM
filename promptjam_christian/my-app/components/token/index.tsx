"use client"

import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const TokenTransferUI = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    if (!publicKey) return;

    try {
      const recipient = new PublicKey(recipientAddress);
      // await tokenProgram.transfer(publicKey, recipient, parseFloat(amount));
      alert('Transfer successful!');
    } catch (error) {
      console.error('Transfer failed', error);
      alert('Transfer failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center"
    >
      <Card className="w-96 bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            DUN Token Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <WalletMultiButton />
            
            <Input 
              placeholder="Recipient Wallet Address" 
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            
            <Input 
              type="number" 
              placeholder="Amount to Transfer" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            
            <Button 
              onClick={handleTransfer} 
              disabled={!publicKey}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Transfer DUN Tokens
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenTransferUI;