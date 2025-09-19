// IU2U GMP Protocol Hooks
import { Chain } from "viem";
import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useReadContract,
  useChainId,
  useWriteContract,
  useBalance,
} from "wagmi";
import { formatUnits } from "viem";

import { useWeb3 } from "./useWeb3";

import { IU2U_ABI, IU2U_GATEWAY_ABI } from "@/contracts/abi-gmp";
import { UseIU2UContractReturn, UseIU2UBalanceReturn } from "@/types/bridge";
import { CONTRACT_ADDRESSES } from "@/config/web3";
import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";
// Hook for IU2U contract instances
export function useIU2UContract(): UseIU2UContractReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if contracts are available for current chain
  const tokenAddress = CONTRACT_ADDRESSES.IU2U_TOKEN[chainId];
  const gatewayAddress = CONTRACT_ADDRESSES.IU2U_GATEWAY[chainId];

  const hasContracts = !!tokenAddress && !!gatewayAddress;
  const isSupported = !!address && hasContracts;

  useEffect(() => {
    if (!isSupported) {
      setError("IU2U contracts not available on this chain");
    } else {
      setError(null);
    }
  }, [isSupported]);

  return {
    iu2uToken: tokenAddress,
    iu2uGateway: gatewayAddress,
    isLoading,
    error,
  };
}
// Hook for IU2U token balance
export function useIU2UBalance(): UseIU2UBalanceReturn {
  const { address } = useWeb3();
  const chainId = useChainId();

  const tokenAddress = CONTRACT_ADDRESSES.IU2U_TOKEN[chainId];

  const {
    data: balance,
    isLoading,
    refetch,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: IU2U_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!tokenAddress,
    },
  });

  const formattedBalance = balance ? formatUnits(balance as bigint, 18) : "0";

  return {
    balance: balance?.toString() || "0",
    formattedBalance,
    isLoading,
    refetch,
  };
}

// Hook for native U2U balance (when on U2U testnet)
export function useNativeU2UBalance() {
  const { address } = useWeb3();
  const chainId = useChainId();

  const {
    data: balance,
    isLoading,
    refetch,
  } = useBalance({
    address: address as `0x${string}`,
    chainId: 2484, // U2U Nebulas Testnet
    query: {
      enabled: !!address && chainId === 2484,
    },
  });

  return {
    balance: balance?.value?.toString() || "0",
    formattedBalance: balance?.formatted || "0",
    isLoading,
    refetch,
  };
}

// Hook for IU2U token operations
export function useIU2UTokenOperations() {
  const { iu2uToken: tokenAddress } = useIU2UContract();
  const { writeContract, isPending, error } = useWriteContract();

  // Deposit U2U for IU2U
  const deposit = useCallback(
    async (amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return writeContract({
        address: tokenAddress as `0x${string}`,
        abi: IU2U_ABI,
        functionName: "deposit",
        value: BigInt(amount) * BigInt(10 ** 18), // Convert to wei
      });
    },
    [tokenAddress, writeContract],
  );

  // Withdraw IU2U for U2U
  const withdraw = useCallback(
    async (amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return writeContract({
        address: tokenAddress as `0x${string}`,
        abi: IU2U_ABI,
        functionName: "withdraw",
        args: [BigInt(amount) * BigInt(10 ** 18)], // Convert to wei
      });
    },
    [tokenAddress, writeContract],
  );

  // Transfer IU2U
  const transfer = useCallback(
    async (to: string, amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return writeContract({
        address: tokenAddress as `0x${string}`,
        abi: IU2U_ABI,
        functionName: "transfer",
        args: [to as `0x${string}`, BigInt(amount) * BigInt(10 ** 18)],
      });
    },
    [tokenAddress, writeContract],
  );

  // Approve IU2U spending
  const approve = useCallback(
    async (spender: string, amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return writeContract({
        address: tokenAddress as `0x${string}`,
        abi: IU2U_ABI,
        functionName: "approve",
        args: [spender as `0x${string}`, BigInt(amount) * BigInt(10 ** 18)],
      });
    },
    [tokenAddress, writeContract],
  );

  return {
    deposit,
    withdraw,
    transfer,
    approve,
    isLoading: isPending,
    error: error?.message || null,
  };
}

// Hook for IU2U Gateway operations
export function useIU2UGatewayOperations() {
  const { iu2uGateway: gatewayAddress } = useIU2UContract();
  const { writeContract, isPending, error } = useWriteContract();

  // Send IU2U tokens cross-chain
  const sendToken = useCallback(
    async (
      destinationChain: string,
      recipient: string,
      symbol: string,
      amount: string,
    ) => {
      if (!gatewayAddress)
        throw new Error("IU2U Gateway contract not available");

      return writeContract({
        address: gatewayAddress as `0x${string}`,
        abi: IU2U_GATEWAY_ABI,
        functionName: "sendToken",
        args: [
          destinationChain,
          recipient as `0x${string}`,
          symbol,
          BigInt(amount) * BigInt(10 ** 18),
        ],
      });
    },
    [gatewayAddress, writeContract],
  );

  // Call contract cross-chain
  const callContract = useCallback(
    async (
      destinationChain: string,
      contractAddress: string,
      payload: string,
    ) => {
      if (!gatewayAddress)
        throw new Error("IU2U Gateway contract not available");

      return writeContract({
        address: gatewayAddress as `0x${string}`,
        abi: IU2U_GATEWAY_ABI,
        functionName: "callContract",
        args: [
          destinationChain,
          contractAddress as `0x${string}`,
          payload as `0x${string}`,
        ],
      });
    },
    [gatewayAddress, writeContract],
  );

  // Call contract with token transfer
  const callContractWithToken = useCallback(
    async (
      destinationChain: string,
      contractAddress: string,
      payload: string,
      symbol: string,
      amount: string,
    ) => {
      if (!gatewayAddress)
        throw new Error("IU2U Gateway contract not available");

      return writeContract({
        address: gatewayAddress as `0x${string}`,
        abi: IU2U_GATEWAY_ABI,
        functionName: "callContractWithToken",
        args: [
          destinationChain,
          contractAddress as `0x${string}`,
          payload as `0x${string}`,
          symbol,
          BigInt(amount) * BigInt(10 ** 18),
        ],
      });
    },
    [gatewayAddress, writeContract],
  );

  return {
    sendToken,
    callContract,
    callContractWithToken,
    isLoading: isPending,
    error: error?.message || null,
  };
}

// Supported chains configuration - using centralized config
export const SUPPORTED_CHAINS: readonly Chain[] = SUPPORTED_BRIDGE_CHAINS;
