// IU2U GMP Protocol Hooks
import { Address, Chain, parseEther } from "viem";
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
import { ACTIVE_CHAINID, CONTRACT_ADDRESSES } from "@/config/web3";
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
export function useIU2UBalance(chainId: number): UseIU2UBalanceReturn {
  const { address } = useWeb3();

  const tokenAddress = CONTRACT_ADDRESSES.IU2U_TOKEN[chainId];

  const {
    data: balance,
    isLoading,
    refetch,
  } = useReadContract({
    address: tokenAddress as Address,
    abi: IU2U_ABI,
    functionName: "balanceOf",
    args: [address as Address],
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
    address: address as Address,
    chainId: ACTIVE_CHAINID, // U2U Solaris Mainnet
    query: {
      enabled: !!address,
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
  const {
    writeContractAsync,
    data: txHash,
    isPending,
    error,
  } = useWriteContract();

  // Deposit U2U for IU2U
  const deposit = useCallback(
    async (amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return await writeContractAsync({
        address: tokenAddress as Address,
        abi: IU2U_ABI,
        functionName: "deposit",
        value: parseEther(amount),
      });
    },
    [tokenAddress, writeContractAsync],
  );

  // Withdraw IU2U for U2U
  const withdraw = useCallback(
    async (amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return await writeContractAsync({
        address: tokenAddress as Address,
        abi: IU2U_ABI,
        functionName: "withdraw",
        args: [parseEther(amount)],
      });
    },
    [tokenAddress, writeContractAsync],
  );

  // Transfer IU2U
  const transfer = useCallback(
    async (to: string, amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return await writeContractAsync({
        address: tokenAddress as Address,
        abi: IU2U_ABI,
        functionName: "transfer",
        args: [to as Address, parseEther(amount)],
      });
    },
    [tokenAddress, writeContractAsync],
  );

  // Approve IU2U spending
  const approve = useCallback(
    async (spender: string, amount: string) => {
      if (!tokenAddress) throw new Error("IU2U token contract not available");

      return await writeContractAsync({
        address: tokenAddress as Address,
        abi: IU2U_ABI,
        functionName: "approve",
        args: [spender as Address, parseEther(amount)],
      });
    },
    [tokenAddress, writeContractAsync],
  );

  return {
    deposit,
    withdraw,
    transfer,
    approve,
    txHash,
    isLoading: isPending,
    error: error?.message || null,
  };
}

// Hook for IU2U Gateway operations
export function useIU2UGatewayOperations() {
  const { iu2uGateway: gatewayAddress } = useIU2UContract();
  const {
    writeContractAsync,
    data: txHash,
    isPending,
    error,
  } = useWriteContract();

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

      return writeContractAsync({
        address: gatewayAddress as Address,
        abi: IU2U_GATEWAY_ABI,
        functionName: "sendToken",
        args: [
          destinationChain,
          recipient as Address,
          symbol,
          parseEther(amount),
        ],
      });
    },
    [gatewayAddress, writeContractAsync],
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

      return await writeContractAsync({
        address: gatewayAddress as Address,
        abi: IU2U_GATEWAY_ABI,
        functionName: "callContract",
        args: [
          destinationChain,
          contractAddress as Address,
          payload as Address,
        ],
      });
    },
    [gatewayAddress, writeContractAsync],
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

      return writeContractAsync({
        address: gatewayAddress as Address,
        abi: IU2U_GATEWAY_ABI,
        functionName: "callContractWithToken",
        args: [
          destinationChain,
          contractAddress as Address,
          payload as Address,
          symbol,
          parseEther(amount),
        ],
      });
    },
    [gatewayAddress, writeContractAsync],
  );

  return {
    sendToken,
    callContract,
    callContractWithToken,
    txHash,
    isLoading: isPending,
    error: error?.message || null,
  };
}

// Supported chains configuration - using centralized config
export const SUPPORTED_CHAINS: readonly Chain[] = SUPPORTED_BRIDGE_CHAINS;
