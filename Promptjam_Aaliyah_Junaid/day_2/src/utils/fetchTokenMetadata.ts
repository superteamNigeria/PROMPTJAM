import { MPL_TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { Connection, PublicKey } from '@solana/web3.js';

interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
}

export async function fetchTokenMetadata(
  connection: Connection,
  mintAddress: string
): Promise<TokenMetadata | null> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID).toBuffer(),
        mintPubkey.toBuffer(),
      ],
      new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
    );

    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if (!accountInfo) return null;

    // Skip the first byte (represents account discriminator)
    const buffer = accountInfo.data.slice(1);
    const metadata = decodeMetadata(buffer);

    return {
      name: metadata.data.name,
      symbol: metadata.data.symbol,
      uri: metadata.data.uri,
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

// Helper function to decode metadata from buffer
function decodeMetadata(buffer: Buffer) {
  // Read the name length and name
  const nameLength = buffer.readUInt32LE(0);
  const name = buffer.slice(4, 4 + nameLength).toString('utf8');

  // Read the symbol length and symbol
  let offset = 4 + nameLength;
  const symbolLength = buffer.readUInt32LE(offset);
  const symbol = buffer
    .slice(offset + 4, offset + 4 + symbolLength)
    .toString('utf8');

  // Read the uri length and uri
  offset = offset + 4 + symbolLength;
  const uriLength = buffer.readUInt32LE(offset);
  const uri = buffer.slice(offset + 4, offset + 4 + uriLength).toString('utf8');

  // Read seller fee basis points
  offset = offset + 4 + uriLength;
  const sellerFeeBasisPoints = buffer.readUInt16LE(offset);

  // Read creators if they exist
  offset = offset + 2;
  const hasCreators = buffer[offset];
  let creators = null;

  if (hasCreators) {
    const creatorCount = buffer.readUInt32LE(offset + 1);
    creators = [];
    offset = offset + 5;

    for (let i = 0; i < creatorCount; i++) {
      const creator = {
        address: new PublicKey(buffer.slice(offset, offset + 32)).toString(),
        verified: buffer[offset + 32] === 1,
        share: buffer[offset + 33],
      };
      creators.push(creator);
      offset += 34;
    }
  }

  return {
    data: {
      name,
      symbol,
      uri,
      sellerFeeBasisPoints,
      creators,
    },
  };
}
