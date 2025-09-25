// Bridge Transaction History Component for IU2U Bridge
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Chip } from "@heroui/chip";

import {
  BridgeTransaction,
  BridgeTransactionHistoryProps,
} from "@/types/bridge";
import {
  getStatusColor,
  getTransactionTypeLabel,
  getExplorerUrl,
} from "@/utils/bridge";

export default function BridgeTransactionHistory({
  transactions,
  onTransactionClick,
}: BridgeTransactionHistoryProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    return date.toLocaleString();
  };

  const getTransactionTypeChip = (type: BridgeTransaction["type"]) => {
    const chipConfig = {
      deposit: { label: "Deposit", color: "success" as const },
      withdraw: { label: "Withdraw", color: "warning" as const },
      sendToken: { label: "Transfer", color: "primary" as const },
      callContract: { label: "Contract", color: "secondary" as const },
      callContractWithToken: {
        label: "Contract+Token",
        color: "default" as const,
      },
    };

    const config = chipConfig[type] || {
      label: type,
      color: "default" as const,
    };

    return (
      <Chip color={config.color} size="sm" variant="flat">
        {config.label}
      </Chip>
    );
  };

  if (transactions.length === 0) {
    return (
      <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Transaction History</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">📋</div>
            <p>No transactions yet</p>
            <p className="text-sm">Your bridge transactions will appear here</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
      <CardHeader>
        <h3 className="text-lg font-bold text-white">Transaction History</h3>
      </CardHeader>
      <CardBody>
        <div className="max-h-80 overflow-y-auto">
          <Accordion className="space-y-2" variant="splitted">
            {transactions.map((transaction) => (
              <AccordionItem
                key={transaction.id}
                aria-label={`${getTransactionTypeLabel(transaction.type)} - ${transaction.amount} ${transaction.symbol}`}
                className="bg-white/5 border border-white/10"
                title={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {getTransactionTypeChip(transaction.type)}
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {transaction.amount} {transaction.symbol}
                        </span>
                        <Chip
                          color={getStatusColor(transaction.status)}
                          size="sm"
                          variant="flat"
                        >
                          {transaction.status}
                        </Chip>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-300">Type:</span>
                      <div className="text-white">
                        {getTransactionTypeLabel(transaction.type)}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-300">Status:</span>
                      <div className="text-white capitalize">
                        {transaction.status}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {transaction.sourceChain && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-300">From:</span>
                        <span className="text-white">
                          {transaction.sourceChain}
                        </span>
                      </div>
                    )}

                    {transaction.destinationChain && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-300">To:</span>
                        <span className="text-white">
                          {transaction.destinationChain}
                        </span>
                      </div>
                    )}

                    {transaction.recipient && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-300">
                          Recipient:
                        </span>
                        <span className="text-white font-mono">
                          {transaction.recipient.slice(0, 6)}...
                          {transaction.recipient.slice(-4)}
                        </span>
                      </div>
                    )}

                    {transaction.contractAddress && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-300">
                          Contract:
                        </span>
                        <span className="text-white font-mono">
                          {transaction.contractAddress.slice(0, 6)}...
                          {transaction.contractAddress.slice(-4)}
                        </span>
                      </div>
                    )}

                    {transaction.txHash && transaction.sourceChain && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-300">
                          Transaction:
                        </span>
                        <button
                          className="text-blue-400 hover:text-blue-300 underline text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const explorerUrl = getExplorerUrl(
                              transaction.sourceChain!,
                              transaction.txHash!,
                            );

                            window.open(explorerUrl, "_blank");
                          }}
                        >
                          View on Explorer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardBody>
    </Card>
  );
}
