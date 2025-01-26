import { useState } from 'react'
import { CollectiblesTab } from './CollectiblesTab'
import { SearchBar } from './SearchBar'
import { TokensTab } from './TokensTab'
import { WalletSummary } from './WalletSummary'

export default function WalletViewer() {
  const [activeTab, setActiveTab] = useState<'tokens' | 'collectibles'>(
    'tokens'
  )
  const [walletAddress, setWalletAddress] = useState<string>('')

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto space-y-6'>
        <SearchBar onSearch={setWalletAddress} />

        {walletAddress && (
          <>
            <WalletSummary address={walletAddress} />

            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4'>
              <div className='flex space-x-4 mb-6'>
                <button
                  onClick={() => setActiveTab('tokens')}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    activeTab === 'tokens'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  Tokens
                </button>
                <button
                  onClick={() => setActiveTab('collectibles')}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    activeTab === 'collectibles'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  Collectibles
                </button>
              </div>

              <div className='min-h-[400px]'>
                {activeTab === 'tokens' ? (
                  <TokensTab address={walletAddress} />
                ) : (
                  <CollectiblesTab address={walletAddress} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
