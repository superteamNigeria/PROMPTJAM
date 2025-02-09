import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { type Connection, PublicKey, Transaction } from '@solana/web3.js';

export function useSolanaWallet() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const sendToken = async (
    tokenMintAddress: string,
    recipientAddress: string,
    amount: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    const tokenMintPublicKey = new PublicKey(tokenMintAddress);
    const recipientPublicKey = new PublicKey(recipientAddress);

    const fromTokenAccount = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      publicKey
    );
    const toTokenAccount = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      recipientPublicKey
    );

    const transaction = new Transaction().add(
      await createTransferInstruction(
        connection,
        publicKey,
        fromTokenAccount,
        toTokenAccount,
        tokenMintPublicKey,
        amount
      )
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
  };

  return { publicKey, connected, sendToken, connection };
}

async function createTransferInstruction(
  connection: Connection,
  payer: PublicKey,
  source: PublicKey,
  destination: PublicKey,
  mint: PublicKey,
  amount: number
) {
  const { createTransferCheckedInstruction } = await import(
    '@solana/spl-token'
  );

  const decimals = (await connection.getTokenSupply(mint)).value.decimals;
  const transferAmount = amount * Math.pow(10, decimals);

  return createTransferCheckedInstruction(
    source,
    mint,
    destination,
    payer,
    transferAmount,
    decimals
  );
}
