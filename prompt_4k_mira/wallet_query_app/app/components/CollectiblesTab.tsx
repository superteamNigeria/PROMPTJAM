import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

interface NFT {
  mint: string
  name?: string
  image?: string
}

export function CollectiblesTab({ address }: { address: string }) {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const connection = new Connection('https://api.mainnet-beta.solana.com')
        const publicKey = new PublicKey(address)

        // This is a placeholder - you'll need to implement proper NFT fetching
        // Consider using additional libraries like Metaplex for proper NFT handling
        setNfts([])
      } catch (error) {
        console.error('Error fetching NFTs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTs()
  }, [address])

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className='animate-pulse bg-gray-100 dark:bg-gray-700 rounded-lg aspect-square'
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
      {nfts.length === 0 ? (
        <div className='col-span-full text-center py-12 text-gray-500 dark:text-gray-400'>
          No collectibles found
        </div>
      ) : (
        nfts.map((nft) => (
          <div
            key={nft.mint}
            className='bg-gray-50 dark:bg-gray-700 rounded-lg p-2'
          >
            {nft.image ? (
              <img
                src={nft.image}
                alt={nft.name || 'NFT'}
                className='w-full h-full object-cover rounded'
              />
            ) : (
              <div className='aspect-square bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center'>
                No Image
              </div>
            )}
            <p className='mt-2 text-sm truncate'>{nft.name || 'Unnamed NFT'}</p>
          </div>
        ))
      )}
    </div>
  )
}
