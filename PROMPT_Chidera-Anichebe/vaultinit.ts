import { Connection, PublicKey, Transaction, TransactionInstruction, Keypair, SystemProgram } from "@solana/web3.js";
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

    // Load wallet as owner
    const ownerKeypair = loadWallet();

    // Generate new keypair for vault state
    const vaultStateKeypair = Keypair.generate();

    // Create PDA for vault auth
    const [vaultAuth] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("auth"),
            vaultStateKeypair.publicKey.toBuffer()
        ],
        PROGRAM_ID
    );

    // Create PDA for vault using vault auth
    const [vaultPDA] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vault"),
            vaultAuth.toBuffer()
        ],
        PROGRAM_ID
    );

    // Create transaction instruction
    const instruction = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
            { pubkey: ownerKeypair.publicKey, isSigner: true, isWritable: true },
            { pubkey: vaultStateKeypair.publicKey, isSigner: true, isWritable: true },
            { pubkey: vaultAuth, isSigner: false, isWritable: false },
            { pubkey: vaultPDA, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([0]) // 0 represents the "initialize" instruction
    });

    // Create and send transaction
    try {
        const transaction = new Transaction().add(instruction);
        transaction.feePayer = ownerKeypair.publicKey;

        // Get latest blockhash
        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;

        // Sign with both owner and vaultState keypairs
        transaction.sign(ownerKeypair, vaultStateKeypair);

        const signature = await connection.sendRawTransaction(
            transaction.serialize()
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