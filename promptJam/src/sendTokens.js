const { Connection, Keypair, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const dotenv = require("dotenv");

dotenv.config();

const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);
const NETWORK = process.env.NETWORK || "devnet";

const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

async function sendTokens(tokenAddress, recipientAddress, amount) {
  const token = new Token(connection, new PublicKey(tokenAddress), TOKEN_PROGRAM_ID, payer);
  const recipientPublicKey = new PublicKey(recipientAddress);

  const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(payer.publicKey);
  const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(recipientPublicKey);

  await token.transfer(
    fromTokenAccount.address,
    toTokenAccount.address,
    payer.publicKey,
    [],
    amount * Math.pow(10, 9) // Adjust for decimals
  );

  console.log("Tokens sent successfully!");
}

sendTokens("TOKEN_ADDRESS", "RECIPIENT_WALLET_ADDRESS", 10).catch(console.error);