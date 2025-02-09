import { AnchorProvider, Program } from '@project-serum/anchor';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { IDL, WbaVault } from './programme/index';

// Initialize connection and provider
const connection = new Connection('https://api.devnet.solana.com');

const wallet = new NodeWallet(Keypair.generate());
const provider = new AnchorProvider(connection, wallet, {
  preflightCommitment: 'recent',
});

// Initialize the program
const programId = new PublicKey('YourProgramPublicKeyHere');
const program = new Program<WbaVault>(IDL, programId, provider);

// Function to initialize the vault
async function initializeVault() {
  const vaultState = Keypair.generate();
  const [vaultAuth, authBump] = await PublicKey.findProgramAddress(
    [Buffer.from('auth'), vaultState.publicKey.toBuffer()],
    programId
  );
  const [vault, vaultBump] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), vaultAuth.toBuffer()],
    programId
  );

  const txInstruction = await program.methods
    .initialize()
    .accounts({
      owner: wallet.publicKey,
      vaultState: vaultState.publicKey,
      vaultAuth,
      vault,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const transaction = new Transaction().add(txInstruction);
  const tx = await provider.sendAndConfirm(transaction, [vaultState]);

  console.log('Vault initialized with transaction:', tx);
}

// Call the function to initialize the vault
initializeVault().catch(console.error);
