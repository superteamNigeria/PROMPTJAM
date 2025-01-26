'use client'

import { useState } from 'react'
import TokenTransfer from './TokenTransfer'

export default function TokenCreator() {
  const [tokenName, setTokenName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCreateToken = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/create-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Prompt-${tokenName}` }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create token')
      }

      setSuccess(`Token created successfully! Mint address: ${data.mint}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8'>Create Your Solana Token</h1>

        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl'>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Token Name
              </label>
              <input
                type='text'
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                placeholder='Enter your name...'
              />
              <p className='mt-2 text-sm text-gray-300'>
                Your token will be named: Prompt-{tokenName}
              </p>
            </div>

            {error && (
              <div className='p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200'>
                {error}
              </div>
            )}

            {success && (
              <div className='p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200'>
                {success}
              </div>
            )}

            {success && <TokenTransfer mintAddress={success.split(': ')[1]} />}

            <button
              onClick={handleCreateToken}
              disabled={loading || !tokenName}
              className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Creating...' : 'Create Token'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
