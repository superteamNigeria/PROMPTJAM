'use client';

import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import React, { useMemo } from 'react';
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { NETWORK } from '@/lib/constant';

// imports here

export default function AppWalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const endpoint = useMemo(() => clusterApiUrl(NETWORK), [NETWORK]);

  const wallets = useMemo(
    () => [
      // manually add any legacy wallet adapters here
      // new UnsafeBurnerWalletAdapter(),
    ],
    [NETWORK]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
