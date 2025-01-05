export const defaultCacheTimeout = 30000 * 60 * 1000;

export const networkConfig = {
  // Using decimal format instead of hex for better compatibility
  chainId: 80001, // Polygon Mumbai Testnet (decimal format of 0x13881)
  chainName: "Polygon Mumbai",  // Simplified name to match standard
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: [
    "https://polygon-mumbai.g.alchemy.com/v2/your-api-key", // Replace with your Alchemy API key
    "https://polygon-mumbai.infura.io/v3/your-api-key",     // Replace with your Infura API key
    "https://rpc-mumbai.maticvigil.com"                     // Public RPC
  ],
  blockExplorerUrls: ["https://mumbai.polygonscan.com"],    // Adding block explorer
  iconUrls: ["https://polygonscan.com/images/svg/brands/polygon.svg"], // Network icon
};


