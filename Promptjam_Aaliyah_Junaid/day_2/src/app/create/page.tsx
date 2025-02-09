'use client';

import { useState } from 'react';
import * as motion from 'motion/react-client';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { CreateTokenForm } from '@/components/CreateTokenForm';
import { AirdropForm } from '@/components/AirdropForm';
import { Notification } from '@/components/Notification';

export default function TokenManager() {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  return (
    <main className="min-h-screen p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-0" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Solana Token Manager
        </motion.h1>

        <div className="mb-12 flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <WalletMultiButton className="!bg-blue-500/80 hover:!bg-blue-600/80 !text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect p-8 rounded-2xl shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-6 text-blue-300">
              Create New Token
            </h2>
            <CreateTokenForm
              onSuccess={(message) => showNotification(message, 'success')}
              onError={(message) => showNotification(message, 'error')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect p-8 rounded-2xl shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-6 text-purple-300">
              Airdrop Tokens
            </h2>
            <AirdropForm
              onSuccess={(message) => showNotification(message, 'success')}
              onError={(message) => showNotification(message, 'error')}
            />
          </motion.div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  );
}
