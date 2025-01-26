import { useState } from 'react'

interface TokenTransferProps {
  mintAddress: string
}

export default function TokenTransfer({ mintAddress }: TokenTransferProps) {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleTransfer = async () => {
    if (!recipientAddress || !amount) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/transfer-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientAddress,
          amount: parseFloat(amount),
          mintAddress,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed')
      }

      setSuccess(
        `Successfully transferred ${amount} tokens to ${recipientAddress}`
      )
      setAmount('')
      setRecipientAddress('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-8'>
      <h2 className='text-2xl font-bold mb-6'>Transfer Tokens</h2>

      <div className='space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Recipient Address
          </label>
          <input
            type='text'
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            placeholder="Enter recipient's Solana address"
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Amount</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            placeholder='Enter amount to transfer'
            min='0'
            step='0.000000001'
          />
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

        <button
          onClick={handleTransfer}
          disabled={loading || !recipientAddress || !amount}
          className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Transferring...' : 'Transfer Tokens'}
        </button>
      </div>
    </div>
  )
}
