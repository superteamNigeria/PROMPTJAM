import { createMint } from '@solana/spl-token'
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    // Use devnet for testing
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    // Generate a new keypair if you don't have one
    const payer = Keypair.generate()

    // Request airdrop for the payer to cover transaction costs
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      1000000000 // 1 SOL
    )

    // Wait for airdrop confirmation
    await connection.confirmTransaction(airdropSignature)

    console.log('Creating mint account...')
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority
      payer.publicKey, // freeze authority
      9 // decimals
    )

    console.log('Token created successfully:', mint.toBase58())

    return NextResponse.json({
      success: true,
      mint: mint.toBase58(),
      name,
      message: 'Token created successfully',
    })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create token',
        details: error,
      },
      { status: 500 }
    )
  }
}
