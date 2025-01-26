import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { recipientAddress, amount, mintAddress } = await request.json()

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const recipient = new PublicKey(recipientAddress)
    const mint = new PublicKey(mintAddress)

    // Get the token accounts for both parties
    const sourceAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer, // You'll need to set this up
      mint,
      payer.publicKey
    )

    const destinationAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      recipient
    )

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      sourceAccount.address,
      destinationAccount.address,
      payer.publicKey,
      BigInt(amount * 10 ** 9) // Assuming 9 decimals
    )

    // Send and confirm transaction
    const transaction = await connection.sendTransaction(transferInstruction, [
      payer,
    ])
    await connection.confirmTransaction(transaction)

    return NextResponse.json({
      success: true,
      signature: transaction,
      message: 'Transfer successful',
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed',
      },
      { status: 500 }
    )
  }
}
