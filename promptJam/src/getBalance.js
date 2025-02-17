const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const dotenv = require("dotenv");

dotenv.config();

const NETWORK = process.env.NETWORK || "devnet";

const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

async function getBalance(tokenAddress, walletAddress) {
  const token = new Token(connection, new PublicKey(tokenAddress), TOKEN_PROGRAM_ID, null);
  const walletPublicKey = new PublicKey(walletAddress);

  const tokenAccount = await token.getOrCreateAssociatedAccountInfo(walletPublicKey);
  console.log("Token Balance:", tokenAccount.amount / Math.pow(10, 9));
}

getBalance("TOKEN_ADDRESS", "WALLET_ADDRESS").catch(console.error);