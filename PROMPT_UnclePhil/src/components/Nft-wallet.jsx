import React, { useState } from "react";
import { getWalletData } from "../services/walletService";

const NftWallet = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleSearch = async () => {
      if (!walletAddress) return;
      setLoading(true);
      setError("");
      try {
        const data = await getWalletData(walletAddress);
        setAssets(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch wallet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    // Separate NFTs and tokens
    const nfts = assets.filter((asset) => asset.interface === "V1_NFT");
    const tokens = assets.filter((asset) => asset.interface !== "V1_NFT");
  
    return (
      <div className="container">
        <div className="header">
          <h1>Wallet Explorer</h1>
          <p>Explore NFTs and tokens owned by a Solana wallet address</p>
        </div>
  
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
  
        {error && <div className="error">{error}</div>}
  
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div>
              <h2>NFTs ({nfts.length})</h2>
              <div className="grid">
                {nfts.map((nft, index) => (
                  <div className="card" key={index}>
                    <img src={nft.content.links.image} alt={nft.content.metadata.name} />
                    <div className="card-content">
                      <h3>{nft.content.metadata.name}</h3>
                      <p>{nft.content.metadata.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            <div>
              <h2>Tokens ({tokens.length})</h2>
              <div className="grid">
                {tokens.map((token, index) => (
                  <div className="card" key={index}>
                    <div className="card-content">
                      <h3>{token.content.metadata.name}</h3>
                      <p>Symbol: {token.content.metadata.symbol}</p>
                      <p>Balance: {token.token_info.balance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default NftWallet;
