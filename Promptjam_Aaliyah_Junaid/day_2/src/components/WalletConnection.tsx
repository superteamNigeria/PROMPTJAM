'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import * as motion from 'motion/react-client';

export function WalletConnection() {
  const { publicKey } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-center justify-between"
    >
      <WalletMultiButton className="!bg-blue-500 hover:!bg-blue-600 !text-white font-bold py-2 px-4 rounded transition duration-300" />
      {publicKey && (
        <span className="text-sm">
          Connected: {publicKey.toBase58().slice(0, 4)}...
          {publicKey.toBase58().slice(-4)}
        </span>
      )}
    </motion.div>
  );
}
