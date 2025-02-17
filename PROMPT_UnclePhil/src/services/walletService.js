import axios from "axios";

// const HELIUS_API_URL = "https://mainnet.helius-rpc.com/?api-key=93c563d8-a365-4f1d-858a-58927f1a9387";
const HELIUS_API_URL = import.meta.env.VITE_HELIUS_API_URL;

export const getWalletData = async (walletAddress) => {
    try {
      const response = await axios.post(
        HELIUS_API_URL,
        {
          jsonrpc: "2.0",
          id: "1",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: walletAddress,
            page: 1,
            limit: 100,
          },
        }
      );
      console.log("API Response:", response.data); // Log the full response
  
      if (!response.data.result) {
        throw new Error("No result found in the API response");
      }
  
      return response.data.result.items || [];
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      throw error;
    }
  };