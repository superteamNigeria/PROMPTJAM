const { Connection, Keypair, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const dotenv = require("dotenv");

dotenv.config();

const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);
const NETWORK = process.env.NETWORK || "devnet";

const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");
const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

async function createToken() {
  const token = await Token.createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    9, // Decimals
    TOKEN_PROGRAM_ID
  );

  console.log("Token created successfully!");
  console.log("Token Address:", token.publicKey.toString());
  return token.publicKey.toString();
}

createToken().catch(console.error);