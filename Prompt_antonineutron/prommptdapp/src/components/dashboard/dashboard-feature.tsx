import { useState } from 'react';
import { AppHero } from '../ui/ui-layout';
// import { Umi, createUmi, generateSigner, createMint } from '@metaplex-foundation/umi';
// import { connection } from '@metaplex-foundation/umi/connection';

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
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');

  const handleSend = () => {
    // Logic to send ANToMAN tokens
    console.log(`Sending ${amount} ANToMAN to ${recipient}`);
  };

  const handleCreateToken = async () => {
    try {
      // const umi = createUmi(connection('https://api.mainnet-beta.solana.com'));
      // const mint = await createMint(umi, {
      //   decimals: 9,
      //   mintAuthority: umi.identity,
      //   freezeAuthority: umi.identity,
      // });
      // console.log(`Created token: ${tokenName} (${tokenSymbol}) with mint address: ${mint.publicKey}`);
    } catch (error) {
      console.error('Error creating token:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-8">
      
    </div>
  );
}