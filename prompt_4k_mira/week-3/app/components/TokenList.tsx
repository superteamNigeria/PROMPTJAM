'use client'

import { useEffect, useState } from 'react'

interface Token {
  mint: string
  amount: number
  decimals: number
  name: string
  symbol: string
  image: string | null
}

export default function TokenList({
  walletAddress,
}: {
  walletAddress: string
}) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          `/api/wallet/tokens?address=${walletAddress}`
        )
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setTokens(data.tokens)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tokens')
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [walletAddress])

  if (loading) return <div className='text-center py-8'>Loading tokens...</div>
  if (error) return <div className='text-red-500 text-center py-8'>{error}</div>

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {tokens.map((token) => (
        <div
          key={token.mint}
          className='p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors'
        >
          <div className='flex items-center gap-3'>
            {token.image && (
              <img
                src={token.image}
                alt={token.name}
                className='w-10 h-10 rounded-full'
              />
            )}
            <div>
              <h3 className='font-semibold'>{token.name}</h3>
              <p className='text-sm text-gray-400'>
                {token.amount} {token.symbol}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
