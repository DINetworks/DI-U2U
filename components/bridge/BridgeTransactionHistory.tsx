// Bridge Transaction History Component for IU2U Bridge
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Badge } from '@heroui/badge';
import { BridgeTransaction, BridgeTransactionHistoryProps } from '@/types/bridge';

export default function BridgeTransactionHistory({
  transactions,
  onTransactionClick
}: BridgeTransactionHistoryProps) {
  const getStatusColor = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getTransactionTypeLabel = (type: BridgeTransaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'Deposit U2U → IU2U';
      case 'withdraw':
        return 'Withdraw IU2U → U2U';
      case 'sendToken':
        return 'Cross-Chain Transfer';
      case 'callContract':
        return 'Contract Call';
      case 'callContractWithToken':
        return 'Contract Call + IU2U';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
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
      <CardBody className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => onTransactionClick?.(transaction)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {getTransactionTypeLabel(transaction.type)}
                  </span>
                  <Badge
                    color={getStatusColor(transaction.status)}
                    variant="flat"
                    size="sm"
                  >
                    {transaction.status}
                  </Badge>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <div>
                    <span className="font-medium">Amount:</span> {transaction.amount} {transaction.symbol}
                  </div>

                  {transaction.sourceChain && (
                    <div>
                      <span className="font-medium">From:</span> {transaction.sourceChain}
                    </div>
                  )}

                  {transaction.destinationChain && (
                    <div>
                      <span className="font-medium">To:</span> {transaction.destinationChain}
                    </div>
                  )}

                  {transaction.recipient && (
                    <div>
                      <span className="font-medium">Recipient:</span>{' '}
                      <span className="font-mono">
                        {transaction.recipient.slice(0, 6)}...{transaction.recipient.slice(-4)}
                      </span>
                    </div>
                  )}

                  {transaction.contractAddress && (
                    <div>
                      <span className="font-medium">Contract:</span>{' '}
                      <span className="font-mono">
                        {transaction.contractAddress.slice(0, 6)}...{transaction.contractAddress.slice(-4)}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="font-medium">Time:</span> {formatTimestamp(transaction.timestamp)}
                  </div>
                </div>
              </div>

              {transaction.txHash && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://polygonscan.com/tx/${transaction.txHash}`, '_blank');
                  }}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15,3 21,3 21,9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}