'use client'

import NFTList from '@/app/components/NFTList'
import TabSelector from '@/app/components/TabSelector'
import TokenList from '@/app/components/TokenList'
import WalletSearch from '@/app/components/WalletSearch'
import { useState } from 'react'

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('')
  const [activeTab, setActiveTab] = useState('tokens')

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text'>
          Solana Wallet Explorer
        </h1>

        <WalletSearch onAddressSubmit={setWalletAddress} />

        {walletAddress && (
          <div className='mt-8'>
            <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

            <div className='mt-6'>
              {activeTab === 'tokens' ? (
                <TokenList walletAddress={walletAddress} />
              ) : (
                <NFTList walletAddress={walletAddress} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
