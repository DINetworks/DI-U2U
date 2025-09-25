import { encodePacked, keccak256 } from "viem";

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
    Ethereum: "https://etherscan.io/tx/",
    BSC: "https://bscscan.com/tx/",
    "BNB Smart Chain": "https://bscscan.com/tx/",
    Polygon: "https://polygonscan.com/tx/",
    Base: "https://basescan.org/tx/",
    Arbitrum: "https://arbiscan.io/tx/",
    Optimism: "https://optimistic.etherscan.io/tx/",
    Avalanche: "https://snowtrace.io/tx/",
    "U2U Nebulas Testnet": "https://testnet.u2uscan.xyz/tx/",
  };

  const baseUrl = explorerUrls[chainName] || "https://etherscan.io/tx/";

  return `${baseUrl}${txHash}`;
};

/**
 * Check command execution status via external API
 */
export const checkCommandStatus = async (commandId: string, chain: string) => {
  try {
    const bridgeRelayerHost = process.env.NEXT_PUBLIC_BRIDGE_RELAYER_HOST;

    if (!bridgeRelayerHost) {
      console.warn("NEXT_PUBLIC_BRIDGE_RELAYER_HOST not configured");

      return null;
    }

    const response = await fetch(
      `${bridgeRelayerHost}/command/${commandId}/${chain}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to check command status:", error);

    return null;
  }
};

/**
 * Get chain name for gateway API calls
 */
export const getChainNameForGateway = (chainId: number) => {
  const chainMap: Record<number, string> = {
    1: "ethereum",
    56: "bsc",
    137: "polygon",
    42161: "arbitrum",
    10: "optimism",
    8453: "base",
    43114: "avalanche",
    2484: "u2u-nebulas-testnet",
  };

  return chainMap[chainId] || "ethereum";
};

/**
 * Calculate commandId from transaction hash and log index
 * commandId = keccak256(encodePacked(['string'], [`${transactionHash}-${logIndex}`]))
 */
export const calculateCommandId = (
  transactionHash: string,
  logIndex: number,
): string => {
  return keccak256(
    encodePacked(["string"], [`${transactionHash}-${logIndex}`]),
  );
};

/* IU2U Gateway event signatures - exact signatures from the contract

  Cross Chain Event Signatures
  ContractCall(address,string,string,bytes32,bytes) => 0x30ae6cc78c27e651745bf2ad08a11de83910ac1e347a52f7ac898c0fbef94dae
  ContractCallWithToken(address,string,string,bytes32,bytes,string,uint256) => 0x7e50569d26be643bda7757722291ec66b1be66d8283474ae3fab5a98f878a7a2
  TokenSent(address,string,string,string,uint256) => 0x651d93f66c4329630e8d0f62488eff599e3be484da587335e8dc0fcf46062726

  evtSigHash = keccak256(encodePacked(['string'], [eventSignature])
*/
const IU2U_EVENT_SIG_HASHS = {
  callContract:
    "0x30ae6cc78c27e651745bf2ad08a11de83910ac1e347a52f7ac898c0fbef94dae",
  callContractWithToken:
    "0x7e50569d26be643bda7757722291ec66b1be66d8283474ae3fab5a98f878a7a2",
  sendToken:
    "0x651d93f66c4329630e8d0f62488eff599e3be484da587335e8dc0fcf46062726",
};

/**
 * Extract commandId from transaction receipt
 * Looks for IU2U gateway events (ContractCall, ContractCallWithToken, TokenSent)
 */
export const extractCommandIdFromReceipt = (
  receipt: any,
  txType: string,
): string | null => {
  if (!receipt || !receipt.logs) return null;

  const eventSignatureHash =
    IU2U_EVENT_SIG_HASHS[txType as keyof typeof IU2U_EVENT_SIG_HASHS];

  if (!eventSignatureHash) {
    console.warn(`No event signature found for transaction type: ${txType}`);

    return null;
  }

  // Look for IU2U gateway events in the logs
  for (const log of receipt.logs) {
    if (log.topics && log.topics.length > 0) {
      const eventSigHash = log.topics[0];

      // Check if this log matches the IU2U event signature
      if (eventSignatureHash === eventSigHash) {
        return calculateCommandId(receipt.transactionHash, log.logIndex);
      }
    }
  }

  return null;
};
