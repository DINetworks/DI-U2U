// IU2U Bridge Configuration using wagmi chains
import { ACTIVE_CHAINID, config } from "./web3";
import { CONTRACT_ADDRESSES } from "./web3";
import { getChainLogo } from "./chains";

// Use wagmi chains configuration with U2U testnet prioritized
const u2u = config.chains.find((chain) => chain.id === ACTIVE_CHAINID);
const otherChains = config.chains.filter(
  (chain) => chain.id !== ACTIVE_CHAINID,
);

export const SUPPORTED_BRIDGE_CHAINS = u2u
  ? [u2u, ...otherChains]
  : config.chains;

// Helper function to get IU2U token address for a chain
export const getIU2UTokenAddress = (chainId: number): string | undefined => {
  return CONTRACT_ADDRESSES.IU2U_TOKEN[chainId];
};

// Helper function to get IU2U gateway address for a chain
export const getIU2UGatewayAddress = (chainId: number): string | undefined => {
  return CONTRACT_ADDRESSES.IU2U_GATEWAY[chainId];
};

// Helper function to get chain logo
export const getBridgeChainLogo = (chainId: number): string => {
  return getChainLogo(chainId);
};

// Helper function to check if chain is supported for bridging
export const isChainSupported = (chainId: number): boolean => {
  return config.chains.some((chain) => chain.id === chainId);
};
