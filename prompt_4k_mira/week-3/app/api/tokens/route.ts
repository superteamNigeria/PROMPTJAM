import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

const connection = new Connection('https://api.mainnet-beta.solana.com')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('wallet')

  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    )
  }

  try {
    const publicKey = new PublicKey(walletAddress)
    const tokens = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    const tokenList = tokens.value.map((token) => ({
      mint: token.account.data.parsed.info.mint,
      amount: token.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: token.account.data.parsed.info.tokenAmount.decimals,
    }))

    return NextResponse.json({ tokens: tokenList })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}
