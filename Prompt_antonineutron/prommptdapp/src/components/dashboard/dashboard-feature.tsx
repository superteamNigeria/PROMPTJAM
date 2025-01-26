import { useState } from 'react';
import { AppHero } from '../ui/ui-layout';

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
];

export default function DashboardFeature() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [receivedTokens, setReceivedTokens] = useState(0);

  const handleSend = () => { 
    // Logic to send ANToMAN tokens
    console.log(`Sending ${amount} ANToMAN to ${recipient}`);
  };

  return (
    <div>
      {/* <AppHero title="gm" subtitle="Say hi to your new Solana dApp." /> */}
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Send ANToMAN Tokens</h2>
          
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Send
          </button>
          <h2 className="text-2xl font-bold mt-6">Received ANToMAN Tokens</h2>
          <p>{receivedTokens} ANToMAN</p>
        </div>
      </div>
    </div>
  );
}
