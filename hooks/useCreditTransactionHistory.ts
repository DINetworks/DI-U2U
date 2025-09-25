import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

import { CreditTransactionHistory } from "@/types/metatx";

const STORAGE_KEY = "metatx-credit-history";

export const useCreditTransactionHistory = () => {
  const { address: userAddress } = useAccount();
  const [history, setHistory] = useState<CreditTransactionHistory[]>([]);

  // Load history from localStorage
  const loadHistory = useCallback(() => {
    if (!userAddress) {
      setHistory([]);

      return;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-${userAddress}`);

      if (stored) {
        const parsedHistory = JSON.parse(stored) as CreditTransactionHistory[];
        // Sort by timestamp (most recent first)
        const sortedHistory = parsedHistory.sort(
          (a, b) => b.timestamp - a.timestamp,
        );

        setHistory(sortedHistory);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.warn("Failed to load credit transaction history:", error);
      setHistory([]);
    }
  }, [userAddress]);

  // Save history to localStorage
  const saveHistory = useCallback(
    (newHistory: CreditTransactionHistory[]) => {
      if (!userAddress) return;

      try {
        localStorage.setItem(
          `${STORAGE_KEY}-${userAddress}`,
          JSON.stringify(newHistory),
        );
      } catch (error) {
        console.warn("Failed to save credit transaction history:", error);
      }
    },
    [userAddress],
  );

  // Add a new transaction to history
  const addTransaction = useCallback(
    (transaction: Omit<CreditTransactionHistory, "id" | "timestamp">) => {
      const newTransaction: CreditTransactionHistory = {
        ...transaction,
        id: `${transaction.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Math.floor(Date.now() / 1000),
      };

      setHistory((prevHistory) => {
        const exists =
          prevHistory.findIndex((tx) => tx.txHash === newTransaction.txHash) !==
          -1;

        if (exists) return prevHistory;

        const updatedHistory = [newTransaction, ...prevHistory];

        saveHistory(updatedHistory);

        return updatedHistory;
      });
    },
    [saveHistory],
  );

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (userAddress) {
      localStorage.removeItem(`${STORAGE_KEY}-${userAddress}`);
    }
  }, [userAddress]);

  // Load history when user address changes
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    addTransaction,
    clearHistory,
    loadHistory,
  };
};
