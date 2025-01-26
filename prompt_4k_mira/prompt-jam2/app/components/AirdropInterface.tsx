import { useState } from 'react'

export default function AirdropInterface({ tokenMint }: { tokenMint: string }) {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAirdrop = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/airdrop-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: recipientAddress,
          amount: parseFloat(amount),
          tokenMint,
        }),
      })
      const data = await response.json()
      // Handle response
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-8'>
      <h2 className='text-2xl font-bold mb-6'>Airdrop Tokens</h2>

      <div className='space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Recipient Address
          </label>
          <input
            type='text'
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg'
            placeholder="Enter recipient's wallet address..."
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Amount</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg'
            placeholder='Enter amount to send...'
          />
        </div>

        <button
          onClick={handleAirdrop}
          disabled={loading}
          className='w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50'
        >
          {loading ? 'Sending...' : 'Send Tokens'}
        </button>
      </div>
    </div>
  )
}
