import { Keypair } from "@solana/web3.js";
import * as fs from 'fs';
import * as path from 'path';

function generateWallet() {
    // Generate new keypair
    const keypair = Keypair.generate();

    // Convert secret key to base58 string
    const secretKey = Buffer.from(keypair.secretKey).toString('base58');

    // Create wallet data object
    const walletData = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: secretKey
    };

    // Ensure wallet directory exists
    const walletDir = path.join(__dirname, '../wallet');
    if (!fs.existsSync(walletDir)) {
        fs.mkdirSync(walletDir, { recursive: true });
    }

    // Save to wallet.json
    fs.writeFileSync(
        path.join(walletDir, 'wallet.json'),
        JSON.stringify(walletData, null, 2)
    );

    console.log('Wallet generated and saved!');
    console.log('Public Key:', keypair.publicKey.toBase58());
}

generateWallet();