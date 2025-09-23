import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { BridgeTransaction } from "@/types/bridge";
import { getExplorerUrl } from "@/utils/bridge";
import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";

interface BridgeTransactionStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BridgeTransaction | null;
}

type StepStatus = "pending" | "completed" | "waiting";

interface Step {
  id: string;
  label: string;
  status: StepStatus;
  description: string;
  chainName?: string;
  txHash?: string;
  destinationTxHash?: string;
}

export default function BridgeTransactionStatusDialog({
  isOpen,
  onClose,
  transaction,
}: BridgeTransactionStatusDialogProps) {
  if (!transaction) return null;

  // Determine current step based on transaction status and type
  const getSteps = (tx: BridgeTransaction): Step[] => {
    const isCrossChain = tx.type === "sendToken" || tx.type === "callContract" || tx.type === "callContractWithToken";

    if (!isCrossChain) {
      // For deposit/withdraw, just show single step
      return [{
        id: "single",
        label: tx.type === "deposit" ? "Deposit U2U → IU2U" : "Withdraw IU2U → U2U",
        status: tx.status === "completed" ? "completed" : tx.status === "failed" ? "pending" : "pending",
        description: tx.status === "completed" ? "Transaction completed successfully" : "Processing transaction...",
      }];
    }

    // For cross-chain transactions
    const sourceSubmitted = !!tx.txHash; // Transaction submitted to source chain
    const sourceConfirmed = sourceSubmitted && !!tx.commandId; // Source confirmed and commandId extracted
    const destinationCompleted = tx.status === "completed";

    return [
      {
        id: "source",
        label: `From ${tx.sourceChain}`,
        status: sourceConfirmed ? "completed" : sourceSubmitted ? "pending" : "pending",
        description: sourceConfirmed
          ? "Transaction confirmed on source chain"
          : sourceSubmitted
            ? "Confirming transaction on source chain..."
            : "Submitting transaction...",
        chainName: tx.sourceChain,
        txHash: tx.txHash,
      },
      {
        id: "destination",
        label: `To ${tx.destinationChain}`,
        status: destinationCompleted ? "completed" : sourceConfirmed ? "pending" : "waiting",
        description: destinationCompleted
          ? "Cross-chain execution completed"
          : sourceConfirmed
            ? "Executing on destination chain..."
            : "Waiting for source chain confirmation...",
        chainName: tx.destinationChain,
        destinationTxHash: destinationCompleted ? tx.destinationTxHash : undefined,
      },
    ];
  };

  const steps = getSteps(transaction);

  const getChainIcon = (chainName: string) => {
    const chainIconMap: Record<string, string> = {
      "U2U Nebulas Testnet": "/images/icons/chains/u2u.png",
      "Ethereum": "/images/icons/chains/ethereum.png",
      "BSC": "/images/icons/chains/bsc.png",
      "BNB Smart Chain": "/images/icons/chains/bsc.png",
      "Polygon": "/images/icons/chains/polygon.png",
      "Base": "/images/icons/chains/base.png",
      "Arbitrum": "/images/icons/chains/arbitrum.png",
      "Optimism": "/images/icons/chains/optimism.png",
      "Avalanche": "/images/icons/chains/avalanche.png",
    };

    const iconPath = chainIconMap[chainName];
    if (iconPath) {
      return (
        <img
          src={iconPath}
          alt={`${chainName} icon`}
          className="w-5 h-5 rounded-full"
        />
      );
    }
    return null;
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
        );
      case "waiting":
        return (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
        );
    }
  };

  const getTransactionTypeLabel = (type: BridgeTransaction["type"]) => {
    switch (type) {
      case "sendToken":
        return "Cross-Chain Token Transfer";
      case "callContract":
        return "Cross-Chain Contract Call";
      case "callContractWithToken":
        return "Cross-Chain Contract Call + Token";
      case "deposit":
        return "Deposit U2U → IU2U";
      case "withdraw":
        return "Withdraw IU2U → U2U";
      default:
        return type;
    }
  };

  const isCompleted = transaction.status === "completed";
  const isFailed = transaction.status === "failed";
  const isCrossChain = transaction.type === "sendToken" || transaction.type === "callContract" || transaction.type === "callContractWithToken";

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      className="p-4"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
            ) : isFailed ? (
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </div>
            )}
            <div>
              <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-600' : isFailed ? 'text-red-600' : 'text-blue-600'}`}>
                {isCompleted
                  ? (isCrossChain ? "Cross-Chain Transfer Complete!" : "Transaction Completed!")
                  : isFailed
                    ? "Transaction Failed"
                    : (isCrossChain ? "Cross-Chain Transfer in Progress" : "Transaction in Progress")
                }
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTransactionTypeLabel(transaction.type)}
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Transaction Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-sm font-semibold">
                {transaction.amount} {transaction.symbol}
              </span>
            </div>

            {transaction.recipient && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recipient</span>
                <span className="text-sm font-mono font-semibold">
                  {transaction.recipient.slice(0, 6)}...{transaction.recipient.slice(-4)}
                </span>
              </div>
            )}

            {transaction.txHash && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Transaction Hash</span>
                <button
                  className="text-sm font-mono text-blue-600 hover:text-blue-800 underline"
                  onClick={() => window.open(getExplorerUrl(transaction.sourceChain, transaction.txHash!), "_blank")}
                >
                  {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
                </button>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Transaction Progress</h4>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {step.chainName && getChainIcon(step.chainName)}
                      <span className={`text-sm font-medium ${
                        step.status === "completed" ? "text-green-600" :
                        step.status === "pending" ? "text-blue-600" : "text-gray-500"
                      }`}>
                        {step.label}
                      </span>
                      {index < steps.length - 1 && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                    {step.txHash && step.chainName && (
                      <div className="mt-2">
                        <button
                          className="text-xs font-mono text-blue-600 hover:text-blue-800 underline"
                          onClick={() => window.open(getExplorerUrl(step.chainName!, step.txHash!), "_blank")}
                        >
                          {step.txHash.slice(0, 10)}...{step.txHash.slice(-8)}
                        </button>
                      </div>
                    )}
                    {step.destinationTxHash && step.chainName && step.destinationTxHash.length > 0 && (
                      <div className="mt-2">
                        <button
                          className="text-xs font-mono text-green-600 hover:text-green-800 underline"
                          onClick={() => window.open(getExplorerUrl(step.chainName!, step.destinationTxHash!), "_blank")}
                        >
                          {step.destinationTxHash.slice(0, 10)}...{step.destinationTxHash.slice(-8)}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {isCompleted ? (
              <>🎉 Your cross-chain transaction has been completed successfully!</>
            ) : isFailed ? (
              <>❌ Your transaction failed. Please try again or contact support.</>
            ) : (
              <>⏳ Please wait while your transaction is being processed across chains...</>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full" color={isCompleted ? "success" : isFailed ? "danger" : "primary"} onPress={onClose}>
            {isCompleted ? "Continue" : isFailed ? "Close" : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}