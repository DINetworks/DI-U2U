import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Link,
} from "@heroui/react";

interface TransactionSuccessData {
  txHash: string;
  batchId: number | null;
  gasCostNative: string;
  requiredValue: string;
  totalNativeCost: string;
  usdValueConsumed: string;
  blockNumber: string;
  blockHash: string;
  status: 'success' | 'failed';
  timestamp: number;
}

interface TransactionSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionData: TransactionSuccessData | null;
}

export default function TransactionSuccessDialog({
  isOpen,
  onClose,
  transactionData,
}: TransactionSuccessDialogProps) {
  if (!transactionData) return null;

  const getBlockExplorerUrl = (txHash: string) => {
    // You can configure this based on the current chain
    // For now, using a generic block explorer pattern
    return `https://polygonscan.com/tx/${txHash}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="p-4"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-green-600">Transaction Successful!</h3>
            <p className="text-sm text-gray-500">Your gasless batch transfer has been completed</p>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Transaction Hash */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Transaction Hash
                </span>
                <Link
                  href={getBlockExplorerUrl(transactionData.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  View on Explorer
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
              <div className="font-mono text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border break-all">
                {transactionData.txHash}
              </div>
            </CardBody>
          </Card>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Transaction Details</h4>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-green-600 capitalize">
                      {transactionData.status}
                    </span>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Block Number</div>
                  <div className="font-semibold">{transactionData.blockNumber}</div>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Batch ID</div>
                  <div className="font-semibold">
                    {transactionData.batchId || 'N/A'}
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Timestamp</div>
                  <div className="font-semibold text-sm">
                    {formatTimestamp(transactionData.timestamp)}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Cost Breakdown</h4>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Gas Cost (Native)</div>
                  <div className="font-semibold">{transactionData.gasCostNative} U2U</div>
                </CardBody>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Total Cost (Native)</div>
                  <div className="font-semibold">{transactionData.totalNativeCost} U2U</div>
                </CardBody>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-900/20">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">Required Credits</div>
                  <div className="font-semibold">{transactionData.requiredValue} U2U</div>
                </CardBody>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-900/20">
                <CardBody className="space-y-2">
                  <div className="text-sm text-gray-500">USD Value Consumed</div>
                  <div className="font-semibold">${transactionData.usdValueConsumed}</div>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            🎉 Your gasless batch transfer has been processed successfully!
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onPress={onClose} className="w-full">
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}