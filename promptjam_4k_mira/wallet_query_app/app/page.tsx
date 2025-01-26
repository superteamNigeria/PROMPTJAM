'use client'

import Image from 'next/image'
import WalletViewer from './components/WalletViewer'

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
      {/* Header */}
      <header className='w-full p-4 flex justify-between items-center border-b dark:border-gray-700'>
        <div className='flex items-center gap-2'>
          <Image
            src='/next.svg'
            alt='Logo'
            width={24}
            height={24}
            className='dark:invert'
          />
          <h1 className='text-xl font-bold'>Solana Wallet Viewer</h1>
        </div>

        <a
          href='https://github.com/yourusername/your-repo'
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
        >
          GitHub ↗
        </a>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold mb-2'>Explore Solana Wallets</h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Enter a Solana wallet address to view its tokens and collectibles
            </p>
          </div>

          <WalletViewer />
        </div>
      </main>

      {/* Footer */}
      <footer className='w-full p-4 text-center text-sm text-gray-600 dark:text-gray-400'>
        <p>Built with Next.js and Solana Web3.js</p>
      </footer>
    </div>
  )
}
