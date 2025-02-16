"use client"

import { useState } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"
import { motion } from "framer-motion"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import axios from "axios"
import WalletForm from "./components/WalletForm"
import NFTList from "./components/NFTList"
import TokenList from "./components/TokenList"

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"

// Token list URL
const TOKEN_LIST_URL = "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"

interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI?: string
}

interface TokenData {
  mint: string
  amount: number
  decimals: number
  symbol: string
  name: string
  logoURI?: string
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("")
  const [nfts, setNfts] = useState([])
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchTokenInfo = async (connection: Connection, tokenList: TokenInfo[], publicKey: PublicKey) => {
    try {
      console.log("Fetching token accounts...")
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      })

      console.log(`Found ${tokenAccounts.value.length} token accounts`)

      const tokenData = await Promise.all(
        tokenAccounts.value
          .filter((account) => {
            const amount = Number(account.account.data.parsed.info.tokenAmount.amount)
            const decimals = account.account.data.parsed.info.tokenAmount.decimals
            return amount > 0 // Filter out empty accounts
          })
          .map(async (account) => {
            const parsedInfo = account.account.data.parsed.info
            const mintAddress = parsedInfo.mint
            const amount = Number(parsedInfo.tokenAmount.amount)
            const decimals = parsedInfo.tokenAmount.decimals

            // Find token info from token list
            let tokenInfo = tokenList.find((t) => t.address.toLowerCase() === mintAddress.toLowerCase())

            if (!tokenInfo) {
              console.log(`Token not found in list: ${mintAddress}. Fetching from chain...`)
              // If not in the list, try to fetch on-chain metadata
              try {
                const mintAccount = await connection.getParsedAccountInfo(new PublicKey(mintAddress))
                const mintData = (mintAccount.value?.data as any).parsed.info
                tokenInfo = {
                  symbol: mintData.symbol || "Unknown",
                  name: mintData.name || "Unknown Token",
                  address: mintAddress,
                  decimals: mintData.decimals,
                }
              } catch (error) {
                console.error(`Error fetching on-chain data for ${mintAddress}:`, error)
              }
            }

            return {
              mint: mintAddress,
              amount,
              decimals,
              symbol: tokenInfo?.symbol || "Unknown",
              name: tokenInfo?.name || "Unknown Token",
              logoURI: tokenInfo?.logoURI,
            }
          }),
      )

      console.log("Token data:", tokenData)
      return tokenData
    } catch (error) {
      console.error("Error fetching token info:", error)
      throw error
    }
  }

  const fetchWalletInfo = async (address: string) => {
    setLoading(true)
    setError("")
    try {
      console.log("Connecting to Solana...")
      const connection = new Connection(SOLANA_RPC_URL, "confirmed")
      const publicKey = new PublicKey(address)
      const metaplex = new Metaplex(connection)

      console.log("Fetching token list...")
      const tokenListResponse = await axios.get(TOKEN_LIST_URL)
      const tokenList = tokenListResponse.data.tokens
      console.log(`Fetched ${tokenList.length} tokens from the list`)

      console.log("Fetching NFTs...")
      const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey })
      setNfts(nfts)

      console.log("Fetching tokens...")
      const tokenData = await fetchTokenInfo(connection, tokenList, publicKey)
      setTokens(tokenData)
    } catch (error) {
      console.error("Error fetching wallet info:", error)
      setError("Failed to fetch wallet info. Please check the wallet address and your RPC endpoint.")
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-900 to-green-900 min-h-screen text-white">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-secondary"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Solana Wallet Explorer
      </motion.h1>
      <WalletForm
        onSubmit={(address) => {
          setWalletAddress(address)
          fetchWalletInfo(address)
        }}
      />
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && (
        <motion.p
          className="text-center mt-4 text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      )}
      {!loading && !error && walletAddress && (
        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <TokenList tokens={tokens} />
          <NFTList nfts={nfts} />
        </motion.div>
      )}
    </main>
  )
}

