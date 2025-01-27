'use client';

import { useState } from 'react';
import * as motion from 'motion/react-client';
import { WalletConnectionProvider } from '../components/WalletConnectionProvider';
import { WalletConnection } from '../components/WalletConnection';
import { AirdropForm } from '../components/AirdropForm';
import { Notification } from '../components/Notification';

export default function Home() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  return (
    <WalletConnectionProvider>
      <main className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Solana Token Transfer
          </h1>
          <WalletConnection />
          <AirdropForm
            onSuccess={(message) => showNotification(message, 'success')}
            onError={(message) => showNotification(message, 'error')}
          />
        </motion.div>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </main>
    </WalletConnectionProvider>
  );
}
