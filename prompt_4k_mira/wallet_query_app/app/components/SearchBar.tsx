import { useState } from 'react'

export function SearchBar({
  onSearch,
}: {
  onSearch: (address: string) => void
}) {
  const [input, setInput] = useState('')

  return (
    <div className='relative'>
      <input
        type='text'
        placeholder='Enter Solana wallet address...'
        className='w-full px-6 py-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg focus:ring-2 focus:ring-purple-500 outline-none'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch(input)}
      />
      <button
        onClick={() => onSearch(input)}
        className='absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
      >
        Search
      </button>
    </div>
  )
}
