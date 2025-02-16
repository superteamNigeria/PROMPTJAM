import { useState } from "react";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [nfts, setNfts] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWalletData = async () => {
    if (!walletAddress) return alert("Please enter a valid wallet address!");
    setLoading(true);

    try {
      // Fetch NFTs
      const nftResponse = await fetch(`https://api.mainnet-beta.solana.com`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            walletAddress,
            { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
            { encoding: "jsonParsed" },
          ],
        }),
      });

      const nftData = await nftResponse.json();
      setNfts(nftData.result.value || []);

      // Fetch recent tokens (example with SOL balance)
      const tokenResponse = await fetch(`https://api.mainnet-beta.solana.com`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [walletAddress],
        }),
      });

      const tokenData = await tokenResponse.json();
      setTokens([{ token: "SOL", balance: tokenData.result.value / 1e9 }]);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Solana Wallet Info</h1>
      <input
        type="text"
        placeholder="Enter Solana wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={fetchWalletData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Wallet Data"}
      </button>

      <h2 className="text-xl font-semibold mt-6">NFTs</h2>
      <ul className="list-disc pl-5">
        {nfts.length > 0 ? (
          nfts.map((nft, index) => (
            <li key={index}>{nft.account.data.parsed.info.mint}</li>
          ))
        ) : (
          <p>No NFTs found.</p>
        )}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Tokens</h2>
      <ul className="list-disc pl-5">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <li key={index}>
              {token.token}: {token.balance}
            </li>
          ))
        ) : (
          <p>No tokens found.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
