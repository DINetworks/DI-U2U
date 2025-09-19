import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

import { BatchTransferHistory } from "@/types/metatx";

const STORAGE_KEY = "metatx-batch-history";

export const useBatchTransferHistory = () => {
  const { address: userAddress } = useAccount();
  const [history, setHistory] = useState<BatchTransferHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage
  const loadHistory = useCallback(() => {
    if (!userAddress) {
      setHistory([]);

      return;
    }

    try {
      setIsLoading(true);
      const stored = localStorage.getItem(`${STORAGE_KEY}-${userAddress}`);

      if (stored) {
        const parsedHistory = JSON.parse(stored) as BatchTransferHistory[];
        // Sort by timestamp (most recent first)
        const sortedHistory = parsedHistory.sort(
          (a, b) => b.timestamp - a.timestamp,
        );

        setHistory(sortedHistory);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to load batch transfer history:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  // Save history to localStorage
  const saveHistory = useCallback(
    (newHistory: BatchTransferHistory[]) => {
      if (!userAddress) return;

      try {
        localStorage.setItem(
          `${STORAGE_KEY}-${userAddress}`,
          JSON.stringify(newHistory),
        );
      } catch (error) {
        console.error("Failed to save batch transfer history:", error);
      }
    },
    [userAddress],
  );

  // Add a new batch transfer to history
  const addBatchTransfer = useCallback(
    (transferData: Omit<BatchTransferHistory, "id" | "timestamp">) => {
      const newTransfer: BatchTransferHistory = {
        ...transferData,
        id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Math.floor(Date.now() / 1000),
      };

      setHistory((prevHistory) => {
        const updatedHistory = [newTransfer, ...prevHistory];

        saveHistory(updatedHistory);

        return updatedHistory;
      });
    },
    [saveHistory],
  );

  // Update an existing batch transfer (e.g., when status changes)
  const updateBatchTransfer = useCallback(
    (id: string, updates: Partial<BatchTransferHistory>) => {
      setHistory((prevHistory) => {
        const updatedHistory = prevHistory.map((transfer) =>
          transfer.id === id ? { ...transfer, ...updates } : transfer,
        );

        saveHistory(updatedHistory);

        return updatedHistory;
      });
    },
    [saveHistory],
  );

  // Remove a batch transfer from history
  const removeBatchTransfer = useCallback(
    (id: string) => {
      setHistory((prevHistory) => {
        const updatedHistory = prevHistory.filter(
          (transfer) => transfer.id !== id,
        );

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
    isLoading,
    addBatchTransfer,
    updateBatchTransfer,
    removeBatchTransfer,
    clearHistory,
    refetch: loadHistory,
  };
};
