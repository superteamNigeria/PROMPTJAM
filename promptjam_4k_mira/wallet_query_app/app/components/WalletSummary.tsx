import { useEffect, useState } from 'react'

export function WalletSummary({ address }: { address: string }) {
  const [solBalance, setSolBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/wallet/balance?address=${address}`)
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setSolBalance(data.balance)
      } catch (error) {
        console.error('Error fetching balance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address])

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-sm text-gray-500 dark:text-gray-400'>
            Wallet Address
          </h2>
          <p className='font-mono text-sm truncate max-w-[200px] sm:max-w-[400px]'>
            {address}
          </p>
        </div>
        <div className='text-right'>
          <h2 className='text-sm text-gray-500 dark:text-gray-400'>
            Total Balance
          </h2>
          {isLoading ? (
            <div className='animate-pulse h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded'></div>
          ) : (
            <p className='text-xl font-bold'>{solBalance.toFixed(4)} SOL</p>
          )}
        </div>
      </div>
    </div>
  )
}
