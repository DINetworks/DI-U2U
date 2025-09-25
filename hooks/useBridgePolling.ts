import { useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

import { BridgeTransaction } from "@/types/bridge";
import {
  checkCommandStatus,
  extractCommandIdFromReceipt,
  getChainNameForGateway,
} from "@/utils/bridge";
import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";

export interface UseBridgePollingProps {
  transactions: BridgeTransaction[];
  pendingTransactionHashes: string[];
  lastTransactionId: string | null;
  crossChainTransactions: {
    id: string;
    commandId: string;
    destinationChain: string;
  }[];
  updateTransaction: (id: string, updates: Partial<BridgeTransaction>) => void;
  addPendingTransactionHash: (hash: string) => void;
  removePendingTransactionHash: (hash: string) => void;
  addCrossChainTransaction: (tx: {
    id: string;
    commandId: string;
    destinationChain: string;
  }) => void;
  removeCrossChainTransaction: (id: string) => void;
  setLastTransactionId: (id: string | null) => void;
}

export function useBridgePolling({
  transactions,
  pendingTransactionHashes,
  lastTransactionId,
  crossChainTransactions,
  updateTransaction,
  addPendingTransactionHash,
  removePendingTransactionHash,
  addCrossChainTransaction,
  removeCrossChainTransaction,
  setLastTransactionId,
}: UseBridgePollingProps) {
  // Watch for transaction confirmations
  const { isSuccess: isTxConfirmed, data: txReceipt } =
    useWaitForTransactionReceipt({
      hash: pendingTransactionHashes[0] as `0x${string}` | undefined,
    });

  // Simulate transaction confirmation for testing
  useEffect(() => {
    if (pendingTransactionHashes.length > 0) {
      const hashToConfirm = pendingTransactionHashes[0];

      const timeoutId = setTimeout(() => {
        // Manually trigger the confirmation logic
        const confirmedTx = transactions.find(
          (tx) => tx.txHash === hashToConfirm,
        );

        if (confirmedTx) {
          const isCrossChain =
            confirmedTx.type === "sendToken" ||
            confirmedTx.type === "callContract" ||
            confirmedTx.type === "callContractWithToken";

          if (!isCrossChain) {
            updateTransaction(confirmedTx.id, { status: "completed" });
          }
        }

        removePendingTransactionHash(hashToConfirm);
      }, 3000); // 3 seconds for faster testing

      return () => clearTimeout(timeoutId);
    }
  }, [
    pendingTransactionHashes,
    transactions,
    updateTransaction,
    removePendingTransactionHash,
  ]);

  // Watch for transaction hash and update pending transaction
  useEffect(() => {
    const currentTxHash = lastTransactionId
      ? transactions.find((tx) => tx.id === lastTransactionId)?.txHash
      : null;

    if (currentTxHash) {
      addPendingTransactionHash(currentTxHash);
      setLastTransactionId(null);
    }
  }, [
    lastTransactionId,
    transactions,
    addPendingTransactionHash,
    setLastTransactionId,
  ]);

  // Watch for transaction confirmations and update status (disabled for testing)
  useEffect(() => {
    if (isTxConfirmed && txReceipt && pendingTransactionHashes.length > 0) {
      const confirmedHash = pendingTransactionHashes[0];

      // Find the transaction that was confirmed
      const confirmedTx = transactions.find(
        (tx) => tx.txHash === confirmedHash,
      );

      if (confirmedTx) {
        // Check if this is a cross-chain transaction
        const isCrossChain =
          confirmedTx.type === "sendToken" ||
          confirmedTx.type === "callContract" ||
          confirmedTx.type === "callContractWithToken";

        if (isCrossChain) {
          // Extract commandId from transaction receipt for cross-chain transactions
          const commandId = extractCommandIdFromReceipt(
            txReceipt,
            confirmedTx.type,
          );

          // Update transaction with commandId
          updateTransaction(confirmedTx.id, {
            commandId: commandId || undefined,
          });

          // Add to cross-chain transactions for polling
          if (commandId && confirmedTx.destinationChain) {
            const destinationChainId = SUPPORTED_BRIDGE_CHAINS.find(
              (chain) => chain.name === confirmedTx.destinationChain,
            )?.id;

            if (destinationChainId) {
              addCrossChainTransaction({
                id: confirmedTx.id,
                commandId,
                destinationChain: destinationChainId.toString(),
              });
            }
          }
        } else {
          // For deposit/withdraw, mark as completed immediately
          updateTransaction(confirmedTx.id, { status: "completed" });
        }
      }

      // Remove from pending hashes
      removePendingTransactionHash(confirmedHash);
    }
  }, [
    isTxConfirmed,
    txReceipt,
    pendingTransactionHashes,
    transactions,
    updateTransaction,
    removePendingTransactionHash,
    addCrossChainTransaction,
  ]);

  // Poll for cross-chain transaction status
  useEffect(() => {
    if (crossChainTransactions.length === 0) return;

    const pollInterval = setInterval(async () => {
      for (const crossChainTx of crossChainTransactions) {
        try {
          const chainName = getChainNameForGateway(
            parseInt(crossChainTx.destinationChain),
          );
          const status = await checkCommandStatus(
            crossChainTx.commandId,
            chainName,
          );

          if (status && status.executed) {
            // Update transaction status to completed and add destination txHash
            updateTransaction(crossChainTx.id, {
              status: "completed",
              destinationTxHash: status.txHash || undefined,
            });

            // Remove from cross-chain transactions
            removeCrossChainTransaction(crossChainTx.id);

            // Update transaction status to completed and add destination txHash
            updateTransaction(crossChainTx.id, {
              status: "completed",
              destinationTxHash: status.txHash || undefined,
            });
          } else if (status && status.pending) {
            // Update status to show destination is pending
            updateTransaction(crossChainTx.id, { status: "pending" });
          }
        } catch (error) {
          console.error("Error polling cross-chain transaction status:", error);
        }
      }
    }, 3000); // Poll every 3 seconds for faster status updates

    return () => clearInterval(pollInterval);
  }, [crossChainTransactions, updateTransaction, removeCrossChainTransaction]);
}
