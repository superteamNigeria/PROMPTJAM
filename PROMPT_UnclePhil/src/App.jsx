import { useState } from 'react'
import './App.css'
import NftWallet from './components/Nft-wallet'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <NftWallet />
    </>
  )
}

export default App
