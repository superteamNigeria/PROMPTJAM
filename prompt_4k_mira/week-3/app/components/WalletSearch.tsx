'use client'

import { useState } from 'react'

interface WalletSearchProps {
  onAddressSubmit: (address: string) => void
}

export default function WalletSearch({ onAddressSubmit }: WalletSearchProps) {
  const [address, setAddress] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onAddressSubmit(address.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
      <div className='flex gap-4'>
        <input
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='Enter Solana wallet address'
          className='flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none'
        />
        <button
          type='submit'
          className='px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors'
        >
          Search
        </button>
      </div>
    </form>
  )
}
