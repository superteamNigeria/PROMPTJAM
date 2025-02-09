'use client';

import {
  Metaplex,
  walletAdapterIdentity,
  toMetaplexFile,
} from '@metaplex-foundation/js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function CreateTokenForm({
  onSuccess,
  onError,
}: {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      onError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity(wallet)
      );
      const { nft } = await metaplex.nfts().create({
        uri: (
          await metaplex.nfts().uploadMetadata({
            name: name,
            symbol: symbol,
            description: description,
            image: logo
              ? await metaplex
                  .storage()
                  .upload(toMetaplexFile(await logo.arrayBuffer(), logo.name))
              : undefined,
          })
        ).uri,
        name: name,
        sellerFeeBasisPoints: 0,
        symbol: symbol,
      });
      onSuccess(
        `Token created successfully! Mint address: ${nft.address.toBase58()}`
      );
    } catch (error) {
      onError(
        `Failed to create token: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2 text-gray-300"
        >
          Token Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
      </motion.div>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <label
          htmlFor="symbol"
          className="block text-sm font-medium mb-2 text-gray-300"
        >
          Token Symbol
        </label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="form-input"
          required
        />
      </motion.div>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2 text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
          rows={3}
        />
      </motion.div>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <label
          htmlFor="logo"
          className="block text-sm font-medium mb-2 text-gray-300"
        >
          Logo
        </label>
        <input
          type="file"
          id="logo"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="form-input"
          accept="image/*"
        />
      </motion.div>
      <motion.button
        type="submit"
        disabled={loading || !wallet.publicKey}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 glow-effect"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Creating Token...
          </div>
        ) : (
          'Create Token'
        )}
      </motion.button>
    </motion.form>
  );
}
