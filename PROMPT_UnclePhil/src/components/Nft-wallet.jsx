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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Separate NFTs and tokens
  const nfts = assets.filter((asset) => asset.interface === "V1_NFT");
  const tokens = assets.filter((asset) => asset.interface !== "V1_NFT");

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(balance);
  };

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
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading"></div>
      ) : (
        <>
          {(nfts.length > 0 || tokens.length > 0) && (
            <>
              {nfts.length > 0 && (
                <div>
                  <h2>NFTs ({nfts.length})</h2>
                  <div className="grid">
                    {nfts.map((nft, index) => (
                      <div className="card" key={index}>
                        <img 
                          src={nft.content.links.image || "/placeholder.svg"} 
                          alt={nft.content.metadata.name}
                          onError={(e) => {
                            e.target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="card-content">
                          <h3>{nft.content.metadata.name}</h3>
                          <p>{nft.content.metadata.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tokens.length > 0 && (
                <div>
                  <h2>Tokens ({tokens.length})</h2>
                  <div className="grid">
                    {tokens.map((token, index) => (
                      <div className="card" key={index}>
                        <div className="card-content">
                          <h3>{token.content.metadata.name}</h3>
                          <span className="token-symbol">
                            {token.content.metadata.symbol}
                          </span>
                          <p className="token-amount">
                            {formatBalance(token.token_info.balance)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {assets.length === 0 && !loading && walletAddress && (
            <div className="error">
              No assets found for this wallet address.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NftWallet;