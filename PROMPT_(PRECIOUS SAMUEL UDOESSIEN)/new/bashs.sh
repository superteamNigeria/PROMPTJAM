#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
for cmd in solana spl-token node npm; do
  if ! command_exists $cmd; then
    echo "$cmd is not installed. Please install it first."
    exit 1
  fi
done

# Connect to Solana devnet
solana config set --url https://api.devnet.solana.com

# Check if a keypair file exists, if not create one
if [ ! -f ~/.config/solana/id.json ]; then
  solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json
fi

# Airdrop some SOL to the account
solana airdrop 2

# Create the Prompt-Precious token
token_address=$(spl-token create-token --decimals 9 | grep "Creating token" | awk '{print $3}')
echo "Prompt-Precious token created with address: $token_address"

# Create a token account
token_account=$(spl-token create-account $token_address | grep "Creating account" | awk '{print $3}')
echo "Token account created: $token_account"

# Mint some initial tokens
spl-token mint $token_address 1000000000 $token_account

# Create a new directory for the web application
mkdir -p prompt-precious-app
cd prompt-precious-app

# Initialize a new Node.js project
npm init -y

# Install necessary dependencies
npm install --save express @solana/web3.js @solana/spl-token react react-dom next

# Create a Next.js app
npx create-next-app@latest .

# Replace the content of pages/index.js with our custom React component
cat << EOF > pages/index.js
import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const tokenAddress = new PublicKey('$token_address');
  const tokenAccountAddress = new PublicKey('$token_account');
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  useEffect(() => {
    getBalance();
  }, []);

  async function getBalance() {
    const token = new Token(connection, tokenAddress, TOKEN_PROGRAM_ID, tokenAccountAddress);
    const accountInfo = await token.getAccountInfo(tokenAccountAddress);
    setBalance(accountInfo.amount.toNumber() / 1e9);
  }

  async function airdropTokens() {
    setMessage('Airdropping tokens...');
    try {
      await fetch('/api/airdrop');
      await getBalance();
      setMessage('Tokens airdropped successfully!');
    } catch (error) {
      setMessage('Error airdropping tokens: ' + error.message);
    }
  }

  async function sendTokens() {
    setMessage('Sending tokens...');
    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount }),
      });
      await getBalance();
      setMessage('Tokens sent successfully!');
    } catch (error) {
      setMessage('Error sending tokens: ' + error.message);
    }
  }

  return (
    <div>
      <h1>Prompt-Precious Token Interface</h1>
      <p>Token Address: {tokenAddress.toBase58()}</p>
      <p>Your Account: {tokenAccountAddress.toBase58()}</p>
      <p>Balance: {balance} PROMPT</p>
      <h2>Airdrop Tokens</h2>
      <button onClick={airdropTokens}>Airdrop 1 TOKEN</button>
      <h2>Send Tokens</h2>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient Address"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={sendTokens}>Send Tokens</button>
      <p>{message}</p>
    </div>
  );
}
EOF

# Create API route for airdropping tokens
mkdir -p pages/api
cat << EOF > pages/api/airdrop.js
import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const tokenAddress = new PublicKey('$token_address');
      const tokenAccountAddress = new PublicKey('$token_account');
      
      const token = new Token(connection, tokenAddress, TOKEN_PROGRAM_ID, tokenAccountAddress);
      await token.mintTo(tokenAccountAddress, tokenAccountAddress, [], 1000000000);
      
      res.status(200).json({ message: 'Airdrop successful' });
    } catch (error) {
      res.status(500).json({ error: 'Error airdropping tokens' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
EOF

# Create API route for sending tokens
cat << EOF > pages/api/send.js
import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { recipient, amount } = req.body;
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const tokenAddress = new PublicKey('$token_address');
      const tokenAccountAddress = new PublicKey('$token_account');
      
      const token = new Token(connection, tokenAddress, TOKEN_PROGRAM_ID, tokenAccountAddress);
      const recipientAccount = new PublicKey(recipient);
      
      await token.transfer(tokenAccountAddress, recipientAccount, tokenAccountAddress, [], amount * 1e9);
      
      res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending tokens' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}
EOF

echo "Setup complete! Your Prompt-Precious token has been created and a web application has been set up."
echo "To start the application, run: cd prompt-precious-app && npm run dev"
echo "Then open http://localhost:3000 in your web browser."
echo "Note: This is a basic implementation for demonstration purposes. For a production application, implement proper security measures and error handling."
