import { BridgeTransaction } from "@/types/bridge";

/**
 * Get the color string for a transaction status
 */
export const getStatusColor = (status: BridgeTransaction["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "default";
  }
};

/**
 * Get the human-readable label for a transaction type
 */
export const getTransactionTypeLabel = (type: BridgeTransaction["type"]) => {
  switch (type) {
    case "deposit":
      return "Deposit U2U → IU2U";
    case "withdraw":
      return "Withdraw IU2U → U2U";
    case "sendToken":
      return "Cross-Chain Transfer";
    case "callContract":
      return "Contract Call";
    case "callContractWithToken":
      return "Contract Call + IU2U";
    default:
      return type;
  }
};

/**
 * Get the block explorer URL for a given chain and transaction hash
 */
export const getExplorerUrl = (chainName: string, txHash: string) => {
  const explorerUrls: Record<string, string> = {
    "Ethereum": "https://etherscan.io/tx/",
    "BSC": "https://bscscan.com/tx/",
    "Polygon": "https://polygonscan.com/tx/",
    "Base": "https://basescan.org/tx/",
    "Arbitrum": "https://arbiscan.io/tx/",
    "Optimism": "https://optimistic.etherscan.io/tx/",
    "Avalanche": "https://snowtrace.io/tx/",
    "U2U Nebulas Testnet": "https://testnet.u2uscan.xyz/tx/",
  };

  const baseUrl = explorerUrls[chainName] || "https://etherscan.io/tx/";
  return `${baseUrl}${txHash}`;
};