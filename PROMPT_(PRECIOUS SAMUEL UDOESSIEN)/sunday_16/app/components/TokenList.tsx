import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ParsedTransactionWithMeta } from "@solana/web3.js"

export default function TokenList({ tokens }: { tokens: ParsedTransactionWithMeta[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Token Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {tokens.length === 0 ? (
          <p>No recent token transactions found.</p>
        ) : (
          <ul className="space-y-2">
            {tokens.map((token, index) => (
              <li key={index} className="border-b pb-2">
                <p className="font-semibold">Transaction: {token.transaction.signatures[0]}</p>
                <p className="text-sm text-gray-600">Block: {token.slot}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

