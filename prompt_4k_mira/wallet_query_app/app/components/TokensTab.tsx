import { useEffect, useState } from 'react'

interface TokenAccount {
  mint: string
  amount: number
  decimals: number
  symbol?: string
  name?: string
  image?: string
  uri?: string
}

export function TokensTab({ address }: { address: string }) {
  const [tokens, setTokens] = useState<TokenAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(`/api/wallet/tokens?address=${address}`)
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setTokens(data.tokens)
        console.log('data', data)
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (address) {
      fetchTokens()
    }
  }, [address])

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='animate-pulse bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-32'
          ></div>
        ))}
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
        No tokens found in this wallet
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {tokens.map((token) => (
        <div
          key={token.mint}
          className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              {token.image ? (
                <img
                  src={token.image}
                  alt={token.name || 'Token'}
                  className='w-12 h-12 rounded-full object-cover bg-white'
                />
              ) : (
                <div className='w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
                  <span className='text-xs'>{token.symbol?.[0] || '?'}</span>
                </div>
              )}
              <div className='space-y-1'>
                <p className='text-lg font-bold'>{token?.name}</p>
                <p className='font-mono text-xs text-gray-500 dark:text-gray-400 truncate w-32'>
                  {token.mint}
                </p>
                <p className='text-lg font-bold'>
                  {token.amount.toLocaleString()} {token.symbol}
                </p>
              </div>
            </div>
            <a
              href={`https://solscan.io/token/${token.mint}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-purple-600 hover:text-purple-700 text-sm'
            >
              View ↗
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
