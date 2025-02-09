import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaVault } from "./programme/index";
import wallet from "./wallet/wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<WbaVault> = new Program(IDL, provider);
const ProgramID = "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o"

 // Generate a new keypair for the vault state account
 const vaultState = Keypair.generate();

 // Derive PDA for vault authority
 const [vaultAuth] = PublicKey.findProgramAddressSync(
   [Buffer.from('auth'), vaultState.publicKey.toBuffer()],
   ProgramID
 );

 // Derive PDA for the vault account
 const [vault] = PublicKey.findProgramAddressSync(
   [Buffer.from('vault'), vaultAuth.toBuffer()],
   ProgramID
 );

(async () => {
  try {
    const txhash = await program.methods
      .initialize()
      .accounts({
        owner: keypair.publicKey,
        systemProgram: ProgramID,
        vault,
        vaultAuth,
        vaultState,
        
        
      })
      .signers([keypair])
      .rpc();


    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
