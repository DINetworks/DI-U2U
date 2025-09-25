import { useState, useEffect, useCallback } from "react";
import { Chain } from "viem";

import { useIU2UTokenOperations, useIU2UGatewayOperations } from "./useIU2U";

import { BridgeTransaction } from "@/types/bridge";
import { getChainNameForGateway } from "@/utils/bridge";

export interface UseBridgeTransactionsReturn {
  // State
  transactions: BridgeTransaction[];
  pendingTransactionHashes: string[];
  lastTransactionId: string | null;
  crossChainTransactions: {
    id: string;
    commandId: string;
    destinationChain: string;
  }[];

  // Actions
  addTransaction: (
    transaction: Omit<BridgeTransaction, "id" | "timestamp">,
  ) => string;
  updateTransaction: (id: string, updates: Partial<BridgeTransaction>) => void;
  removeTransaction: (id: string) => void;
  addPendingTransactionHash: (hash: string) => void;
  removePendingTransactionHash: (hash: string) => void;
  setLastTransactionId: (id: string | null) => void;
  addCrossChainTransaction: (tx: {
    id: string;
    commandId: string;
    destinationChain: string;
  }) => void;
  removeCrossChainTransaction: (id: string) => void;

  // Transaction operations
  executeDeposit: (amount: string) => Promise<void>;
  executeWithdraw: (amount: string) => Promise<void>;
  executeSendToken: (
    destinationChain: Chain,
    recipientAddress: string,
    bridgeAmount: string,
  ) => Promise<void>;
  executeContractCall: (
    destinationChain: Chain,
    contractAddress: string,
    payload: string,
    callAmount?: string,
  ) => Promise<void>;
}

export function useBridgeTransactions(): UseBridgeTransactionsReturn {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [pendingTransactionHashes, setPendingTransactionHashes] = useState<
    string[]
  >([]);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(
    null,
  );
  const [crossChainTransactions, setCrossChainTransactions] = useState<
    { id: string; commandId: string; destinationChain: string }[]
  >([]);

  const tokenOps = useIU2UTokenOperations();
  const gatewayOps = useIU2UGatewayOperations();

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("bridge-transactions");

    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);

        setTransactions(parsed);
      } catch (error) {
        console.error("Failed to parse saved transactions:", error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("bridge-transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = useCallback(
    (transactionData: Omit<BridgeTransaction, "id" | "timestamp">) => {
      const id = Date.now().toString();
      const transaction: BridgeTransaction = {
        ...transactionData,
        id,
        timestamp: Date.now(),
      };

      setTransactions((prev) => [transaction, ...prev]);

      return id;
    },
    [],
  );

  const updateTransaction = useCallback(
    (id: string, updates: Partial<BridgeTransaction>) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
      );
    },
    [],
  );

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const addPendingTransactionHash = useCallback((hash: string) => {
    setPendingTransactionHashes((prev) => [...prev, hash]);
  }, []);

  const removePendingTransactionHash = useCallback((hash: string) => {
    setPendingTransactionHashes((prev) => prev.filter((h) => h !== hash));
  }, []);

  const addCrossChainTransaction = useCallback(
    (tx: { id: string; commandId: string; destinationChain: string }) => {
      setCrossChainTransactions((prev) => [...prev, tx]);
    },
    [],
  );

  const removeCrossChainTransaction = useCallback((id: string) => {
    setCrossChainTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  // Handle user rejection errors
  const handleTransactionError = (error: any, operation: string) => {
    if (
      error?.name === "ContractFunctionExecutionError" &&
      error?.message?.includes("User rejected the request")
    ) {
      return true; // Handled gracefully
    }
    console.error(`${operation} failed:`, error);

    return false; // Not a user rejection, re-throw or handle differently
  };

  const executeDeposit = useCallback(
    async (amount: string) => {
      try {
        const txHash = await tokenOps.deposit(amount);

        // Add transaction to history after user approval
        const transactionId = addTransaction({
          type: "deposit",
          sourceChain: "U2U Nebulas Testnet", // Fixed for deposit
          amount,
          symbol: "IU2U",
          status: "pending",
          txHash,
        });

        setLastTransactionId(transactionId);
      } catch (error: any) {
        if (!handleTransactionError(error, "deposit")) {
          throw error; // Re-throw if not a user rejection
        }
      }
    },
    [tokenOps, addTransaction],
  );

  const executeWithdraw = useCallback(
    async (amount: string) => {
      try {
        const txHash = await tokenOps.withdraw(amount);

        // Add transaction to history after user approval
        const transactionId = addTransaction({
          type: "withdraw",
          sourceChain: "U2U Nebulas Testnet", // Fixed for withdraw
          amount,
          symbol: "IU2U",
          status: "pending",
          txHash,
        });

        setLastTransactionId(transactionId);
      } catch (error: any) {
        if (!handleTransactionError(error, "withdraw")) {
          throw error;
        }
      }
    },
    [tokenOps, addTransaction],
  );

  const executeSendToken = useCallback(
    async (
      destinationChain: Chain,
      recipientAddress: string,
      bridgeAmount: string,
    ) => {
      try {
        const destinationChainName = getChainNameForGateway(
          destinationChain.id,
        );
        const txHash = await gatewayOps.sendToken(
          destinationChainName,
          recipientAddress,
          "IU2U",
          bridgeAmount,
        );

        // Add transaction to history after user approval
        const transactionId = addTransaction({
          type: "sendToken",
          sourceChain: "U2U Nebulas Testnet", // Assuming source is always U2U for now
          destinationChain: destinationChain.name,
          recipient: recipientAddress,
          amount: bridgeAmount,
          symbol: "IU2U",
          status: "pending",
          txHash,
        });

        setLastTransactionId(transactionId);
      } catch (error: any) {
        if (!handleTransactionError(error, "cross-chain transfer")) {
          throw error;
        }
      }
    },
    [gatewayOps, addTransaction],
  );

  const executeContractCall = useCallback(
    async (
      destinationChain: Chain,
      contractAddress: string,
      payload: string,
      callAmount?: string,
    ) => {
      try {
        const destinationChainName = getChainNameForGateway(
          destinationChain.id,
        );

        let txHash;

        if (callAmount) {
          txHash = await gatewayOps.callContractWithToken(
            destinationChainName,
            contractAddress,
            payload,
            "IU2U",
            callAmount,
          );
        } else {
          txHash = await gatewayOps.callContract(
            destinationChainName,
            contractAddress,
            payload,
          );
        }

        // Add transaction to history after user approval
        const transactionId = addTransaction({
          type: callAmount ? "callContractWithToken" : "callContract",
          sourceChain: "U2U Nebulas Testnet", // Assuming source is always U2U for now
          destinationChain: destinationChain.name,
          contractAddress,
          amount: callAmount || "",
          symbol: "IU2U",
          status: "pending",
          txHash,
        });

        setLastTransactionId(transactionId);
      } catch (error: any) {
        if (!handleTransactionError(error, "contract call")) {
          throw error;
        }
      }
    },
    [gatewayOps, addTransaction],
  );

  return {
    // State
    transactions,
    pendingTransactionHashes,
    lastTransactionId,
    crossChainTransactions,

    // Actions
    addTransaction: addTransaction as any, // Type workaround
    updateTransaction,
    removeTransaction,
    addPendingTransactionHash,
    removePendingTransactionHash,
    setLastTransactionId,
    addCrossChainTransaction,
    removeCrossChainTransaction,

    // Transaction operations
    executeDeposit,
    executeWithdraw,
    executeSendToken,
    executeContractCall,
  };
}
