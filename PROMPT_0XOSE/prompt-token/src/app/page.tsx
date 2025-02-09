'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export default function Home() {
  const { publicKey, signTransaction } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  // Replace this with your token's mint address after creation
  const TOKEN_MINT = new PublicKey('YOUR_TOKEN_MINT_ADDRESS');
  const connection = new Connection('https://api.devnet.solana.com');

  const sendToken = async () => {
    if (!publicKey || !signTransaction) {
      setStatus('Please connect your wallet first');
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipientAddress);
      const token = new Token(
        connection,
        TOKEN_MINT,
        TOKEN_PROGRAM_ID,
        publicKey
      );

      const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(publicKey);
      const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipientPubKey);

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          publicKey,
          [],
          parseFloat(amount) * LAMPORTS_PER_SOL
        )
      );

      const signature = await signTransaction(transaction);
      const result = await connection.sendRawTransaction(signature.serialize());
      setStatus(`Transaction sent! Signature: ${result}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">PROMPT-0XOSE Token Interface</h1>
        
        <div className="mb-8 text-center">
          <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" />
        </div>

        {publicKey && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter recipient's wallet address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to send"
              />
            </div>

            <button
              onClick={sendToken}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Send Tokens
            </button>

            {status && (
              <div className="mt-4 p-4 rounded bg-gray-100">
                <p>{status}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
