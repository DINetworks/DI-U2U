import axios from "axios";
import { Address, erc20Abi } from "viem";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { CONTRACT_ADDRESSES } from "@/config/web3";
import {
  GAS_CREDIT_VAULT_ABI as VAULT_ABI,
  METATX_GATEWAY_ABI as GATEWAY_ABI,
} from "@/contracts/abi";

const TOKEN_CHAIN_ID = 56;

export const gatewayAddress = CONTRACT_ADDRESSES.METATX_GATEWAY as Address;
export const vaultAddress = CONTRACT_ADDRESSES.CREDIT_VAULT as Address;

export const useGaslessContracts = () => {
  const { address: owner, chain, chainId } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contractInfo, setContractInfo] = useState<{
    gatewayVersion: string | null;
    vaultMinimumConsume: bigint | null;
    isPaused: boolean;
    whitelistedTokens: readonly Address[];
  }>({
    gatewayVersion: null,
    vaultMinimumConsume: null,
    isPaused: false,
    whitelistedTokens: [],
  });

  const publicClient = usePublicClient({ chainId });
  const vaultPublicClient = usePublicClient({ chainId: TOKEN_CHAIN_ID });

  const { data: walletClient } = useWalletClient();

  // Initialize and validate contracts
  const initializeContracts = useCallback(async () => {
    if (!vaultAddress || !vaultPublicClient) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate contracts by calling view functions
      const [minimumConsume, isPaused, whitelistedTokens] = await Promise.all([
        vaultPublicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "minimumConsume",
        }),
        vaultPublicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "paused",
        }),
        vaultPublicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: "getWhitelistedTokens",
        }),
      ]);

      setContractInfo({
        gatewayVersion: "1", // From the MetaTx-Contracts repo
        vaultMinimumConsume: minimumConsume as bigint,
        whitelistedTokens: whitelistedTokens as readonly Address[],
        isPaused: isPaused as boolean,
      });
    } catch (err) {
      console.error("Contract initialization failed:", err);
      setError(
        `Contract validation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [vaultPublicClient]);

  // Gateway contract functions (memoized)
  const getNonce = useCallback(async (): Promise<bigint> => {
    if (!publicClient) throw new Error("Public client not available");

    return (await publicClient.readContract({
      address: gatewayAddress,
      abi: GATEWAY_ABI,
      functionName: "nonces",
      args: [owner],
    })) as Promise<bigint>;
  }, [publicClient, owner]);

  const getBatchTransactionLog = useCallback(
    async (
      batchId: bigint,
    ): Promise<readonly [string, bigint, bigint, boolean]> => {
      if (!publicClient) throw new Error("Public client not available");

      return (await publicClient.readContract({
        address: gatewayAddress,
        abi: GATEWAY_ABI,
        functionName: "getBatchTransactionLog",
        args: [batchId],
      })) as Promise<readonly [string, bigint, bigint, boolean]>;
    },
    [publicClient],
  );

  const getTotalBatchCount = useCallback(async (): Promise<bigint> => {
    if (!publicClient) throw new Error("Public client not available");

    return (await publicClient.readContract({
      address: gatewayAddress,
      abi: GATEWAY_ABI,
      functionName: "getTotalBatchCount",
    })) as Promise<bigint>;
  }, [publicClient]);

  const generateEIP712Signature = useCallback(
    async ({
      metaTxs,
      deadline,
    }: {
      metaTxs: any[];
      deadline: number;
    }): Promise<string> => {
      if (!walletClient) throw new Error("Wallet not connected");
      if (!chain?.id) throw new Error("Chain not available");

      const nonce = await getNonce();

      const domain = {
        name: "MetaTxGateway", // must match contract
        version: "1", // must match contract
        chainId: chain.id,
        verifyingContract: gatewayAddress,
      };

      const types = {
        MetaTransaction: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
        MetaTransactions: [
          { name: "from", type: "address" },
          { name: "metaTxs", type: "MetaTransaction[]" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        from: owner,
        metaTxs, // array of {to, value, data}
        nonce,
        deadline,
      };

      return walletClient.signTypedData({
        account: owner,
        domain,
        types,
        primaryType: "MetaTransactions",
        message,
      });
    },
    [publicClient, owner, chain?.id, walletClient],
  );

  const estimateTransfer = useCallback(
    async ({
      metaTxs,
      signature,
      relayerHost = process.env.NEXT_PUBLIC_RELAYER_HOST,
      deadline,
    }: {
      metaTxs: any[];
      signature: string;
      relayerHost?: string;
      deadline: number;
    }) => {
      if (!chain?.id) throw new Error("Chain not available");

      const endpoint = `${relayerHost}/meta-tx/estimate`;
      const nonce = await getNonce();
      const params = {
        chainId: chain.id,
        from: owner,
        metaTxs: metaTxs.map((tx: any) => ({
          ...tx,
          value: tx.value.toString(),
        })),
        nonce: nonce.toString(),
        deadline,
        signature,
      };

      const { data } = await axios.post(endpoint, params);

      return data;
    },
    [chain?.id, owner, getNonce],
  );

  const relayErc20BatchTransfers = useCallback(
    async ({
      metaTxs,
      signature,
      relayerHost = process.env.NEXT_PUBLIC_RELAYER_HOST,
      deadline,
    }: {
      metaTxs: any[];
      signature: string;
      relayerHost?: string;
      deadline: number;
    }) => {
      if (!publicClient) throw new Error("Public client not available");
      if (!chain?.id) throw new Error("Chain not available");

      // Send to relayer
      const endpoint = `${relayerHost}/meta-tx/execute`;
      const nonce = await getNonce();
      const params = {
        chainId: chain.id,
        from: owner,
        metaTxs: metaTxs.map((tx: any) => ({
          ...tx,
          value: tx.value.toString(),
        })),
        nonce: nonce.toString(),
        deadline,
        signature,
      };

      const { data } = await axios.post(endpoint, params);

      return data;
    },
    [publicClient, getNonce, owner, chain?.id],
  );

  const gatewayContract = useMemo(
    () => ({
      getNonce,
      getBatchTransactionLog,
      getTotalBatchCount,
      estimateTransfer,
      generateEIP712Signature,
      relayErc20BatchTransfers,
    }),
    [
      getNonce,
      getBatchTransactionLog,
      getTotalBatchCount,
      estimateTransfer,
      generateEIP712Signature,
      relayErc20BatchTransfers,
    ],
  );

  // Vault contract functions (memoized)
  const getApprovedAmount = useCallback(
    async (token: Address): Promise<bigint> => {
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");
      if (!owner) throw new Error("Owner not available");

      return (await vaultPublicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: "allowance",
        args: [owner, vaultAddress],
      })) as bigint;
    },
    [vaultPublicClient, owner],
  );

  const approve = useCallback(
    async (token: Address, amount: bigint) => {
      if (!walletClient) throw new Error("Wallet not connected");

      return await walletClient.writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [vaultAddress, amount],
      });
    },
    [walletClient],
  );

  const approveForGateway = useCallback(
    async (token: Address, amount: bigint) => {
      if (!walletClient) throw new Error("Wallet not connected");

      return await walletClient.writeContract({
        address: token,
        abi: erc20Abi,
        functionName: "approve",
        args: [gatewayAddress, amount],
      });
    },
    [walletClient],
  );

  const getCredits = useCallback(async (): Promise<bigint> => {
    if (!vaultPublicClient)
      throw new Error("Vault public client not available");
    if (!owner) throw new Error("Owner not available");

    return (await vaultPublicClient.readContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "credits",
      args: [owner],
    })) as bigint;
  }, [vaultPublicClient, owner]);

  const getCreditsInToken = useCallback(
    async (tokenAddress: Address): Promise<bigint> => {
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");
      if (!owner) throw new Error("Owner not available");

      return (await vaultPublicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "creditsInToken",
        args: [owner, tokenAddress],
      })) as bigint;
    },
    [vaultPublicClient, owner],
  );

  const getWhitelistedTokens = useCallback(async (): Promise<
    readonly Address[]
  > => {
    if (!vaultPublicClient)
      throw new Error("Vault public client not available");

    return (await vaultPublicClient.readContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "getWhitelistedTokens",
    })) as readonly Address[];
  }, [vaultPublicClient]);

  const getWhitelistedRelayers = useCallback(async (): Promise<
    readonly Address[]
  > => {
    if (!vaultPublicClient)
      throw new Error("Vault public client not available");

    return (await vaultPublicClient.readContract({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: "getWhitelistedRelayers",
    })) as readonly Address[];
  }, [vaultPublicClient]);

  const getCreditValue = useCallback(
    async (tokenAddress: Address, amount: bigint): Promise<bigint> => {
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");

      return (await vaultPublicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "getCreditValue",
        args: [tokenAddress, amount],
      })) as bigint;
    },
    [vaultPublicClient],
  );

  const calculateTokenValue = useCallback(
    async (tokenAddress: Address, creditAmount: bigint): Promise<bigint> => {
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");

      return (await vaultPublicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "getTokenValue",
        args: [tokenAddress, creditAmount],
      })) as bigint;
    },
    [vaultPublicClient],
  );

  const deposit = useCallback(
    async (tokenAddress: Address, amount: bigint) => {
      if (!walletClient) throw new Error("Wallet not connected");
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");
      const { request } = await vaultPublicClient.simulateContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [tokenAddress, amount],
        account: walletClient.account,
      });

      return await walletClient.writeContract(request);
    },
    [walletClient, vaultPublicClient],
  );

  const withdraw = useCallback(
    async (creditAmount: bigint) => {
      if (!walletClient) throw new Error("Wallet not connected");
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");
      const { request } = await vaultPublicClient.simulateContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "withdraw",
        args: [creditAmount],
        account: walletClient.account,
      });

      return await walletClient.writeContract(request);
    },
    [walletClient, vaultPublicClient],
  );

  const transferCredit = useCallback(
    async (receiverAddress: Address, creditAmount: bigint) => {
      if (!walletClient) throw new Error("Wallet not connected");
      if (!vaultPublicClient)
        throw new Error("Vault public client not available");
      const { request } = await vaultPublicClient.simulateContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "transferCredit",
        args: [receiverAddress, creditAmount],
        account: walletClient.account,
      });

      return await walletClient.writeContract(request);
    },
    [walletClient, vaultPublicClient],
  );

  const vaultContract = useMemo(
    () => ({
      getApprovedAmount,
      approve,
      approveForGateway,
      getCredits,
      getCreditsInToken,
      getWhitelistedTokens,
      getWhitelistedRelayers,
      getCreditValue,
      calculateTokenValue,
      deposit,
      withdraw,
      transferCredit,
    }),
    [
      getApprovedAmount,
      approve,
      approveForGateway,
      getCredits,
      getCreditsInToken,
      getWhitelistedTokens,
      getWhitelistedRelayers,
      getCreditValue,
      calculateTokenValue,
      deposit,
      withdraw,
      transferCredit,
    ],
  );

  // Initialize contracts when dependencies change
  useEffect(() => {
    initializeContracts();
  }, [initializeContracts, publicClient, vaultPublicClient]);

  return {
    isLoading,
    error,
    contractInfo,
    gatewayContract,
    vaultContract,
    initializeContracts,
  };
};
