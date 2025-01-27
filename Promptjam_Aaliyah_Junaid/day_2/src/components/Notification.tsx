'use client';

import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';

export function Notification({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <p className="text-white">{message}</p>
          <button
            onClick={onClose}
            className="absolute top-1 right-1 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
