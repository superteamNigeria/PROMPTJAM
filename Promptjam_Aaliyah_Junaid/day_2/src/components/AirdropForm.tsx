'use client';

import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchTokenMetadata } from '../utils/fetchTokenMetadata';

interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
}

export function AirdropForm({
  onSuccess,
  onError,
}: {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenMint, setTokenMint] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(
    null
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenMint) {
        const metadata = await fetchTokenMetadata(connection, tokenMint);
        setTokenMetadata(metadata);
      } else {
        setTokenMetadata(null);
      }
    };

    fetchMetadata();
  }, [tokenMint, connection]);

  const handleAirdrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      onError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const recipientPublicKey = new PublicKey(address);
      const tokenMintPublicKey = new PublicKey(tokenMint);
      const tokenAmount = Number.parseFloat(amount);

      // Get the sender's associated token account
      const senderATA = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        wallet.publicKey
      );

      // Get the recipient's associated token account
      const recipientATA = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        recipientPublicKey
      );

      const transaction = new Transaction();

      // Check if recipient's ATA exists, if not, create it
      try {
        await connection.getAccountInfo(recipientATA);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            recipientATA,
            recipientPublicKey,
            tokenMintPublicKey
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderATA,
          recipientATA,
          wallet.publicKey,
          BigInt(tokenAmount)
        )
      );

      // Send and confirm transaction
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      onSuccess(
        `Successfully sent ${amount} ${
          tokenMetadata?.symbol || 'tokens'
        } to ${address}`
      );
    } catch (error) {
      onError(
        `Token transfer failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleAirdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="tokenMint" className="block text-sm font-medium mb-1">
          Token Mint Address
        </label>
        <input
          type="text"
          id="tokenMint"
          value={tokenMint}
          onChange={(e) => setTokenMint(e.target.value)}
          className="form-input"
          placeholder="Enter token mint address"
          required
        />
      </div>
      {tokenMetadata && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-4 rounded-lg flex items-center space-x-4"
        >
          {tokenMetadata.uri && (
            <img
              src={tokenMetadata.uri}
              alt={tokenMetadata.name}
              className="w-12 h-12 object-cover rounded-full ring-2 ring-purple-500/50"
            />
          )}
          <h3 className="text-lg font-semibold text-purple-300">
            {tokenMetadata.name}
            <span className="text-gray-400 text-sm ml-2">
              ({tokenMetadata.symbol})
            </span>
          </h3>
        </motion.div>
      )}
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Recipient Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="form-input"
          placeholder="Enter recipient Solana address"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-input"
          placeholder="Enter token amount"
          step="1"
          min="1"
          required
        />
      </div>
      <motion.button
        type="submit"
        disabled={loading || !wallet.publicKey}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 glow-effect"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Processing...
          </div>
        ) : (
          'Send Tokens'
        )}
      </motion.button>
    </motion.form>
  );
}
