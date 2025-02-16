'use client'

import { useEffect, useState } from 'react'

interface NFT {
  mint: string
  name: string
  image: string | null
  uri: string | null
}

export default function NFTList({ walletAddress }: { walletAddress: string }) {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        // First fetch all tokens
        const response = await fetch(
          `/api/wallet/tokens?address=${walletAddress}`
        )
        const data = await response.json()
        if (data.error) throw new Error(data.error)

        // Filter for tokens that have metadata and images (likely NFTs)
        const nftTokens = data.tokens.filter((token: NFT) => token.image)
        setNfts(nftTokens)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NFTs')
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [walletAddress])

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-pulse text-purple-400'>Loading NFTs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-red-500 text-center py-8 bg-red-500/10 rounded-lg'>
        {error}
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className='text-center py-8 bg-gray-800/50 rounded-lg'>
        No NFTs found in this wallet
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {nfts.map((nft) => (
        <div
          key={nft.mint}
          className='bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20'
        >
          {nft.image && (
            <div className='aspect-square w-full relative'>
              <img
                src={nft.image}
                alt={nft.name}
                className='w-full h-full object-cover'
              />
            </div>
          )}
          <div className='p-4'>
            <h3 className='font-semibold truncate text-lg'>{nft.name}</h3>
            <p className='text-xs text-gray-400 mt-1 truncate'>{nft.mint}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
