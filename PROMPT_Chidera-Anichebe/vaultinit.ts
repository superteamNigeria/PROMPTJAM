import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import * as fs from 'fs';
import * as path from 'path';

// Replace with your Helius API key
const HELIUS_API_KEY = "YOUR_HELIUS_API_KEY";
const PROGRAM_ID = new PublicKey("D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o");

// Load wallet from wallet.json
function loadWallet(): Keypair {
    const walletPath = path.join(__dirname, 'wallet', 'wallet.json');
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    return Keypair.fromSecretKey(bs58.decode(walletData.privateKey));
}

async function initiateVault() {
    // Initialize connection to Solana devnet through Helius
    const connection = new Connection(
        `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        'confirmed'
    );

    // Load wallet
    const payerKeypair = loadWallet();

    // Create PDAs for vault
    const [vaultPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payerKeypair.publicKey.toBuffer()],
        PROGRAM_ID
    );

    // Create transaction instruction
    const instruction = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
            { pubkey: payerKeypair.publicKey, isSigner: true, isWritable: true },
            { pubkey: vaultPDA, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([0]) // 0 represents the "initiate_vault" instruction
    });

    // Create and send transaction
    try {
        const transaction = new Transaction().add(instruction);
        transaction.feePayer = payerKeypair.publicKey;

        // Get latest blockhash
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;

        const signature = await connection.sendTransaction(
            transaction,
            [payerKeypair]
        );

        console.log("Transaction sent! Signature:", signature);

        // Wait for confirmation
        await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        });
        console.log("Transaction confirmed!");

    } catch (error) {
        console.error("Error:", error);
    }
}

// Export the function
export { initiateVault };