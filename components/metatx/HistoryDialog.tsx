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
  Tabs,
  Tab,
  Link,
  Chip,
} from "@heroui/react";
import { useCreditTransactionHistory } from "@/hooks/useCreditTransactionHistory";
import { useBatchTransferHistory } from "@/hooks/useBatchTransferHistory";
import { HistoryDialogProps } from "@/types/component"

export default function HistoryDialog({
  isOpen,
  onClose,
  initialTab = "transfers",
}: HistoryDialogProps) {
  const { history: creditTransactionHistory, isLoading: creditLoading, getBlockExplorerUrl } = useCreditTransactionHistory();
  const { history: batchTransferHistory, isLoading: batchLoading } = useBatchTransferHistory();
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatCreditChange = (change: string, type: string) => {
    const value = parseFloat(change);
    const sign = type === 'deposit' ? '+' : '-';
    const color = type === 'deposit' ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {sign}{Math.abs(value).toFixed(3)} U2U
      </span>
    );
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="p-4"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Transaction History</h3>
        </ModalHeader>

        <ModalBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as "transfers" | "credits")}
            className="w-full"
          >
            <Tab key="transfers" title="Batch Transfers">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {batchTransferHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <p>No batch transfer history yet</p>
                    <p className="text-sm">Your gasless transactions will appear here</p>
                  </div>
                ) : (
                  batchTransferHistory.map((transfer) => (
                    <Card key={transfer.id} className="bg-gray-50 dark:bg-gray-800">
                      <CardBody className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {transfer.status === 'success' ? (
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                            )}
                            <span className="font-medium">
                              Batch Transfer #{transfer.id.slice(-8)}
                            </span>
                            <Chip
                              size="sm"
                              color={transfer.status === 'success' ? 'success' : 'danger'}
                              variant="flat"
                            >
                              {transfer.status}
                            </Chip>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatTimestamp(transfer.timestamp)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Credit Used:</span>
                            <div className="font-medium">{transfer.creditConsumed} U2U</div>
                          </div>
                          <div>
                            <span className="text-gray-400">USD Value:</span>
                            <div className="font-medium">${transfer.usdValueConsumed}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Gas Cost:</span>
                            <div className="font-medium">{transfer.gasCostNative} U2U</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Block:</span>
                            <div className="font-medium">#{transfer.blockNumber}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {transfer.transfers.length} transfer{transfer.transfers.length !== 1 ? 's' : ''}
                          </div>
                          <Link
                            href={getBlockExplorerUrl(transfer.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Transaction
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>

            <Tab key="credits" title="Credit Transactions">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {creditTransactionHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <p>No credit transaction history yet</p>
                    <p className="text-sm">Your deposits and withdrawals will appear here</p>
                  </div>
                ) : (
                  creditTransactionHistory.map((transaction) => (
                    <Card key={transaction.id} className="bg-gray-50 dark:bg-gray-800">
                      <CardBody className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Chip
                              size="sm"
                              color={transaction.type === 'deposit' ? 'success' : 'warning'}
                              variant="flat"
                            >
                              {transaction.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                            </Chip>
                            <span className="font-medium">
                              {transaction.amount} {transaction.token?.symbol || 'U2U'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatTimestamp(transaction.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-400">Credit:</span>
                            <span className="font-medium ml-2">
                              {transaction.creditBefore} → {transaction.creditAfter} ({formatCreditChange(transaction.creditChanged, transaction.type)})
                            </span>
                          </div>
                          
                          {transaction.txHash && (
                            <div className="flex justify-end">
                              <Link
                                href={getBlockExplorerUrl(transaction.txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View Transaction
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>
                          )}
                        </div>                        
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onPress={onClose} className="w-full">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}