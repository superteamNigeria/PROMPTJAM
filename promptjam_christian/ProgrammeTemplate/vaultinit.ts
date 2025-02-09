import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaVault } from "./programme/index";
import wallet from "../ProgrammeTemplate/wallet/wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(
  connection,
  new Wallet(keypair),
  { commitment: "confirmed" }
);

// Convert string to PublicKey
const programId = new PublicKey("D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o");

const program = new Program<WbaVault>(IDL, programId, provider);

// Generate a new keypair for the vault state account
const vaultState = Keypair.generate();

// Derive PDA for vault authority
const [vaultAuth] = PublicKey.findProgramAddressSync(
  [Buffer.from('auth'), vaultState.publicKey.toBuffer()],
  programId  // Use programId instead of ProgramID
);

// Derive PDA for the vault account
const [vault] = PublicKey.findProgramAddressSync(
  [Buffer.from('vault'), vaultAuth.toBuffer()],
  programId  // Use programId instead of ProgramID
);

(async () => {
  try {

    console.log(keypair.publicKey.toBase58(), "address")
    const txhash = await program.methods
      .initialize()
      .accounts({
        owner: keypair.publicKey,
        systemProgram: SystemProgram.programId,  // Use SystemProgram.programId instead of ProgramID
        vault,
        vaultAuth,
        vaultState: vaultState.publicKey,  // Use vaultState.publicKey
      })
      .signers([keypair, vaultState])  // Add vaultState to signers
      .rpc();

    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();