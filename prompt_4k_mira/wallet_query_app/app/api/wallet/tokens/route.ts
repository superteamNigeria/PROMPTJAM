import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import { NextResponse } from 'next/server'

async function getTokenMetadata(origin: string, mint: string) {
  try {
    const response = await fetch(
      `${origin}/api/wallet/get-token-meta-data?token_mint=${mint}`
    )
    const data = await response.json()
    console.log('token', data)
    return {
      name: data?.name || data?.json?.name || 'Unknown Token',
      symbol: data.symbol || '???',
      uri: data.uri || null,
      image: data.image || data.json?.image || null,
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error)
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com')
    const publicKey = new PublicKey(address)

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: TOKEN_PROGRAM_ID }
    )

    const tokens = await Promise.all(
      tokenAccounts.value
        .filter(
          (account) => account.account.data.parsed.info.tokenAmount.uiAmount > 0
        )
        .map(async (account) => {
          const mint = account.account.data.parsed.info.mint
          const metadata = await getTokenMetadata(origin, mint)
          return {
            mint,
            amount: account.account.data.parsed.info.tokenAmount.uiAmount,
            decimals: account.account.data.parsed.info.tokenAmount.decimals,
            name: metadata?.name || 'Unknown Token',
            symbol: metadata?.symbol || '???',
            uri: metadata?.uri || null,
            image: metadata?.image || null,
          }
        })
    )

    return NextResponse.json({ tokens })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}
