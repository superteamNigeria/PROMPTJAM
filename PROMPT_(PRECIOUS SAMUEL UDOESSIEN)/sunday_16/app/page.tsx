"use client"

import { useState } from "react"
import { Connection, PublicKey, clusterApiUrl, type ParsedTransactionWithMeta } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"
import WalletForm from "./components/WalletForm"
import NFTList from "./components/NFTList"
import TokenList from "./components/TokenList"

const SOLANA_RPC_URL = clusterApiUrl("mainnet-beta")

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("")
  const [nfts, setNfts] = useState([])
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchWalletInfo = async (address: string) => {
    setLoading(true)
    setError("")
    setNfts([])
    setTokens([])

    try {
      const connection = new Connection(SOLANA_RPC_URL, "confirmed")
      const publicKey = new PublicKey(address)

      if (!PublicKey.isOnCurve(publicKey.toBuffer())) {
        throw new Error("Invalid Solana address")
      }

      const metaplex = new Metaplex(connection)

      // Fetch NFTs
      try {
        const nftResponse = await metaplex.nfts().findAllByOwner({ owner: publicKey })
        setNfts(nftResponse)
      } catch (nftError) {
        console.error("Error fetching NFTs:", nftError)
        setError((prev) => prev + "Failed to fetch NFTs. ")
      }

      // Fetch recent transactions
      try {
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 })
        const transactions = await connection.getParsedTransactions(signatures.map((sig) => sig.signature))

        const tokenTransactions = transactions
          .filter((tx): tx is ParsedTransactionWithMeta => tx !== null)
          .filter((tx) => {
            const instructions = tx.transaction.message.instructions
            return instructions.some((ix) => "program" in ix && ix.program === "spl-token")
          })

        setTokens(tokenTransactions)
      } catch (tokenError) {
        console.error("Error fetching token transactions:", tokenError)
        setError((prev) => prev + "Failed to fetch recent transactions. ")
      }
    } catch (error) {
      console.error("Error fetching wallet info:", error)
      setError(`Error: ${error.message || "Unknown error occurred"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Solana Wallet Info</h1>
      <WalletForm
        onSubmit={(address) => {
          setWalletAddress(address)
          fetchWalletInfo(address)
        }}
      />
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {!loading && !error && walletAddress && (
        <div className="mt-8">
          <NFTList nfts={nfts} />
          <TokenList tokens={tokens} />
        </div>
      )}
    </main>
  )
}

