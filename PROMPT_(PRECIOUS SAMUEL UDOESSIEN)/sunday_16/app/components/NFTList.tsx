import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NFTList({ nfts }: { nfts: any[] }) {
  return (
    <Card className="mb-8 bg-purple-800 text-white">
      <CardHeader>
        <CardTitle className="text-secondary">NFTs ({nfts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {nfts.length === 0 ? (
          <p>No NFTs found in this wallet.</p>
        ) : (
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {nfts.map((nft, index) => (
              <motion.li
                key={index}
                className="border border-purple-600 rounded p-4 bg-purple-900"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <h3 className="font-semibold text-secondary">{nft.name}</h3>
                <p className="text-sm text-purple-300">{nft.mintAddress.toString()}</p>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </CardContent>
    </Card>
  )
}

