import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NFTList({ nfts }: { nfts: any[] }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>NFTs ({nfts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {nfts.length === 0 ? (
          <p>No NFTs found in this wallet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft, index) => (
              <li key={index} className="border rounded p-4">
                <h3 className="font-semibold">{nft.name}</h3>
                <p className="text-sm text-gray-600">{nft.mintAddress.toString()}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

