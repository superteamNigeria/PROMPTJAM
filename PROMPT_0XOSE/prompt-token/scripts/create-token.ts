import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as fs from 'fs';

async function createToken() {
    // Connect to devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // Generate a new wallet keypair
    const payer = Keypair.generate();

    // Request airdrop of SOL
    console.log('Requesting airdrop...');
    const airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        1000000000 // 1 SOL
    );
    await connection.confirmTransaction(airdropSignature);

    // Create new token mint
    const mint = await Token.createMint(
        connection,
        payer,
        payer.publicKey,
        null,
        9, // 9 decimals
        TOKEN_PROGRAM_ID
    );

    console.log('Token created successfully!');
    console.log('Token Mint Address:', mint.publicKey.toString());

    // Save the mint address to a file
    const tokenInfo = {
        mintAddress: mint.publicKey.toString(),
        payerSecretKey: Array.from(payer.secretKey)
    };

    fs.writeFileSync('token-info.json', JSON.stringify(tokenInfo, null, 2));
    console.log('Token information saved to token-info.json');
}

createToken().catch(console.error);
