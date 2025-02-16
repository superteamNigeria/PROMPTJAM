import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface TokenData {
  mint: string
  amount: number
  decimals: number
  symbol: string
  name: string
  logoURI?: string
}

export default function TokenList({ tokens }: { tokens: TokenData[] }) {
  const formatAmount = (amount: number, decimals: number) => {
    return (amount / Math.pow(10, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <Card className="mb-8 bg-purple-800 text-white">
      <CardHeader>
        <CardTitle className="text-secondary">Tokens ({tokens.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {tokens.length === 0 ? (
          <p>No tokens found in this wallet.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {tokens.map((token, index) => (
              <motion.div
                key={token.mint}
                className="flex items-center p-4 rounded-lg bg-purple-900/50 border border-purple-600"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 mr-4 relative">
                  {token.logoURI ? (
                    <Image
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center">
                      <span className="text-lg font-bold">{token.symbol[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-secondary flex items-center gap-2">
                    {token.name || "Unknown Token"}
                    <span className="text-sm text-purple-300">({token.symbol || "Unknown"})</span>
                  </h3>
                  <p className="text-lg font-medium">{formatAmount(token.amount, token.decimals)}</p>
                  <p className="text-xs text-purple-300 truncate">{token.mint}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

