import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { BridgeTransaction } from "@/types/bridge";
import { getTransactionTypeLabel, getExplorerUrl } from "@/utils/bridge";

interface BridgeTransactionCompleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BridgeTransaction | null;
}

export default function BridgeTransactionCompleteDialog({
  isOpen,
  onClose,
  transaction,
}: BridgeTransactionCompleteDialogProps) {
  if (!transaction) return null;

  const getStatusIcon = (status: BridgeTransaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        );
      case "failed":
        return (
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        );
    }
  };

  const getStatusColor = (status: BridgeTransaction["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <Modal
      backdrop="blur"
      className="p-4"
      isOpen={isOpen}
      size="md"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon(transaction.status)}
            <div>
              <h3
                className={`text-xl font-bold ${getStatusColor(transaction.status)}`}
              >
                Transaction{" "}
                {transaction.status === "completed"
                  ? "Complete!"
                  : transaction.status === "failed"
                    ? "Failed"
                    : "Pending"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTransactionTypeLabel(transaction.type)}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Transaction Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Transaction Type
              </span>
              <span className="text-sm font-semibold capitalize">
                {getTransactionTypeLabel(transaction.type)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Amount
              </span>
              <span className="text-sm font-semibold">
                {transaction.amount} {transaction.symbol}
              </span>
            </div>

            {transaction.sourceChain && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  From Chain
                </span>
                <span className="text-sm font-semibold">
                  {transaction.sourceChain}
                </span>
              </div>
            )}

            {transaction.destinationChain && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  To Chain
                </span>
                <span className="text-sm font-semibold">
                  {transaction.destinationChain}
                </span>
              </div>
            )}

            {transaction.recipient && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Recipient
                </span>
                <span className="text-sm font-mono font-semibold">
                  {transaction.recipient.slice(0, 6)}...
                  {transaction.recipient.slice(-4)}
                </span>
              </div>
            )}

            {transaction.contractAddress && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Contract
                </span>
                <span className="text-sm font-mono font-semibold">
                  {transaction.contractAddress.slice(0, 6)}...
                  {transaction.contractAddress.slice(-4)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Timestamp
              </span>
              <span className="text-sm font-semibold">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>

            {transaction.txHash && transaction.sourceChain && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Transaction Hash
                </span>
                <button
                  className="text-sm font-mono text-blue-600 hover:text-blue-800 underline"
                  onClick={() => {
                    const explorerUrl = getExplorerUrl(
                      transaction.sourceChain!,
                      transaction.txHash!,
                    );

                    window.open(explorerUrl, "_blank");
                  }}
                >
                  {transaction.txHash.slice(0, 10)}...
                  {transaction.txHash.slice(-8)}
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {transaction.status === "completed" ? (
              <>🎉 Your bridge transaction has been completed successfully!</>
            ) : transaction.status === "failed" ? (
              <>
                ❌ Your transaction failed. Please try again or contact support.
              </>
            ) : (
              <>⏳ Your transaction is being processed...</>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full" color="primary" onPress={onClose}>
            {transaction.status === "completed" ? "Continue" : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
