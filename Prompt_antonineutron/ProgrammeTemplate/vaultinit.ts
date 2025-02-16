import {
    Connection,
    Keypair,
    SystemProgram,
    PublicKey,
    Commitment,
} from "@solana/web3.js";
import { Program, Wallet, AnchorProvider, Address } from "@coral-xyz/anchor";
import { WbaVault, IDL } from "../ProgrammeTemplate/programme/index.ts";
import wallet from "../ProgrammeTemplate/wallet/wallet.json";

// Program ID on devnet
const PROGRAM_ID = new PublicKey("D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o");

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const commitment: Commitment = "confirmed";

const connection = new Connection("https://api.devnet.solana.com", commitment);

// Create AnchorProvider instance
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment,
});

// Create program instance
const program = new Program(IDL, PROGRAM_ID, provider);

// Vault interaction function
async function initializeVault() {
    try {
        // Generate vault PDAs
        const [vaultAuth] = PublicKey.findProgramAddressSync(
            [Buffer.from("auth"), keypair.publicKey.toBuffer()],
            program.programId
        );
        
        const [vaultState] = PublicKey.findProgramAddressSync(
            [Buffer.from("vault"), keypair.publicKey.toBuffer()],
            program.programId
        );

        // Initialize vault
        const tx = await program.methods
            .initialize()
            .accounts({
                owner: keypair.publicKey,
                vaultState,
                vaultAuth,
                systemProgram: SystemProgram.programId,
            })
            .signers([keypair])
            .rpc();

        console.log("Vault initialized! Transaction:", tx);
        return tx;
    } catch (error) {
        console.error("Error initializing vault:", error);
        throw error;
    }
}

// Execute initialization
initializeVault().catch(console.error);
