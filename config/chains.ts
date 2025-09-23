// Chain logos and icons configuration
export const CHAIN_LOGOS: Record<number, string> = {
  // Mainnet chains
  1: "/images/icons/chains/ethereum.png", // Ethereum
  56: "/images/icons/chains/bsc.png", // BSC
  137: "/images/icons/chains/polygon.png", // Polygon
  8453: "/images/icons/chains/base.png", // Base
  42161: "/images/icons/chains/arbitrum.png", // Arbitrum
  10: "/images/icons/chains/optimism.png", // Optimism
  43114: "/images/icons/chains/avalanche.png", // Avalanche

  // Testnet chains
  2484: "/images/icons/chains/u2u.png", // U2U Nebulas Testnet (using u2s icon as placeholder)
};

// Helper function to get chain logo
export const getChainLogo = (chainId: number): string => {
  return CHAIN_LOGOS[chainId] || "/images/icons/chains/ethereum.png"; // fallback to ethereum
};

// Helper function to get chain name from ID
export const getChainName = (chainId: number | undefined): string => {
  if (!chainId) return "Unknown";
  
  const chainNames: Record<number, string> = {
    1: "Ethereum",
    56: "BSC",
    137: "Polygon",
    8453: "Base",
    42161: "Arbitrum",
    10: "Optimism",
    43114: "Avalanche",
    2484: "U2U Nebulas Testnet",
  };

  return chainNames[chainId] || "Unknown";
};


export const getChainNameForGateway = (chainId: number) => {
  const chainNames: Record<number, string> = {
    1: "ethereum",
    56: "bsc",
    137: "polygon",
    8453: "base",
    42161: "arbitrum",
    10: "optimism",
    43114: "avalanche",
    2484: "u2u-nebulas-testnet",
  };

  return chainNames[chainId] || "Unknown";
};