import React, { useState, useEffect } from "react"
import { Connection, PublicKey, Keypair } from "@solana/web3.js"
import { Program, AnchorProvider, web3 } from "@project-serum/anchor"
import idl from "./idl.json"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { useWallet, WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"

const programID = new PublicKey("YOUR_PROGRAM_ID")
const opts = {
  preflightCommitment: "processed",
}

function App() {
  const [balance, setBalance] = useState(0)
  const wallet = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    if (wallet.publicKey) {
      getBalance()
    }
  }, [wallet.publicKey])

  const getProvider = () => {
    const connection = new Connection("https://api.devnet.solana.com")
    const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment)
    return provider
  }

  const getBalance = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      const tokenAccount = await program.account.tokenAccount.fetch(wallet.publicKey)
      setBalance(tokenAccount.amount.toNumber())
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const airdropTokens = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      await program.rpc.mintTo(new BN(1000000000), {
        accounts: {
          mint: programID,
          tokenAccount: wallet.publicKey,
          authority: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      })
      await getBalance()
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const sendTokens = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl, programID, provider)
      await program.rpc.transfer(new BN(amount), {
        accounts: {
          from: wallet.publicKey,
          to: new PublicKey(recipient),
          authority: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      })
      await getBalance()
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  if (!wallet.connected) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
        <WalletMultiButton />
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>Prompt-Precious Token</h1>
      <p>Your balance: {balance} PROMPT</p>
      <button onClick={airdropTokens} style={{ marginTop: "20px" }}>
        Airdrop Tokens
      </button>
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={sendTokens}>Send Tokens</button>
      </div>
    </div>
  )
}

export default () => (
  <ConnectionProvider endpoint="https://api.devnet.solana.com">
    <WalletProvider wallets={[new PhantomWalletAdapter()]}>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

