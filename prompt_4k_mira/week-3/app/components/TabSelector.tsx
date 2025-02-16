interface TabSelectorProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabSelector({
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  return (
    <div className='flex gap-4 border-b border-gray-700'>
      <button
        onClick={() => onTabChange('tokens')}
        className={`px-4 py-2 -mb-px ${
          activeTab === 'tokens'
            ? 'border-b-2 border-purple-500 text-purple-500'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        Tokens
      </button>
      <button
        onClick={() => onTabChange('nfts')}
        className={`px-4 py-2 -mb-px ${
          activeTab === 'nfts'
            ? 'border-b-2 border-purple-500 text-purple-500'
            : 'text-gray-400 hover:text-gray-300'
        }`}
      >
        NFTs
      </button>
    </div>
  )
}
