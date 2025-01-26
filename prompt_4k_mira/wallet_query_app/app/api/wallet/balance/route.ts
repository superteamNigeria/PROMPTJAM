import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com')
    const publicKey = new PublicKey(address)
    const balance = await connection.getBalance(publicKey)

    return NextResponse.json({ balance: balance / LAMPORTS_PER_SOL })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}
