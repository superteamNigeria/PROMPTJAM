import { Command } from 'commander';
import fetch from 'node-fetch';
import chalk from 'chalk';

const HELIUS_API_KEY = 'YOUR_HELIUS_API_KEY';
const HELIUS_API_URL = `https://api.helius.xyz/v0`;

interface NFTMetadata {
    name: string;
    symbol: string;
    image: string;
    collection?: {
        name: string;
    };
}

interface TokenData {
    mint: string;
    amount: number;
    decimals: number;
    tokenName?: string;
}

async function getNFTs(walletAddress: string): Promise<NFTMetadata[]> {
    const response = await fetch(
        `${HELIUS_API_URL}/addresses/${walletAddress}/nfts?api-key=${HELIUS_API_KEY}`
    );
    const data = await response.json();
    return data.nfts || [];
}

async function getRecentTokens(walletAddress: string, limit: number = 10): Promise<TokenData[]> {
    const response = await fetch(
        `${HELIUS_API_URL}/addresses/${walletAddress}/balances?api-key=${HELIUS_API_KEY}`
    );
    const data = await response.json();
    return data.tokens?.slice(0, limit) || [];
}

async function displayNFTs(nfts: NFTMetadata[]) {
    console.log(chalk.blue.bold('\nNFTs:'));
    console.log(chalk.blue('='.repeat(50)));

    for (const nft of nfts) {
        console.log(chalk.green(`Name: ${nft.name}`));
        console.log(`Collection: ${nft.collection?.name || 'N/A'}`);
        console.log(`Symbol: ${nft.symbol}`);
        console.log(chalk.gray('-------------------'));
    }
}

async function displayTokens(tokens: TokenData[]) {
    console.log(chalk.yellow.bold('\nRecent Tokens:'));
    console.log(chalk.yellow('='.repeat(50)));

    for (const token of tokens) {
        console.log(chalk.green(`Token: ${token.tokenName || token.mint}`));
        console.log(`Amount: ${token.amount / Math.pow(10, token.decimals)}`);
        console.log(chalk.gray('-------------------'));
    }
}

const program = new Command();

program
    .name('token-tracker')
    .description('CLI tool to track NFTs and tokens for a Solana wallet')
    .version('1.0.0');

program
    .command('track')
    .description('Track NFTs and tokens for a wallet address')
    .argument('<wallet>', 'Wallet address to track')
    .option('-t, --tokens-only', 'Show only tokens')
    .option('-l, --limit <number>', 'Limit the number of tokens shown', '10')
    .action(async (wallet, options) => {
        try {
            console.log(chalk.cyan(`Fetching data for wallet: ${wallet}`));

            if (!options.tokensOnly) {
                const nfts = await getNFTs(wallet);
                await displayNFTs(nfts);
            }

            const tokens = await getRecentTokens(wallet, parseInt(options.limit));
            await displayTokens(tokens);

        } catch (error) {
            console.error(chalk.red('Error:', error.message));
        }
    });

program.parse();