import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Alert } from "@heroui/alert";
import { isAddress } from "viem";

import TransferPreviewDialog from "./TransferPreviewDialog";
import TransactionSuccessDialog from "./TransactionSuccessDialog";

import { useWeb3 } from "@/hooks/useWeb3";
import { GaslessBatchTransferProps } from "@/types/metatx";
import TransferRow from "@/components/metatx/TransferRow";
import { useBatchTransferHistory } from "@/hooks/useBatchTransferHistory";

export default function GaslessBatchTransfer({
  credit,
  approvedTokens,
  onShowHistory,
}: GaslessBatchTransferProps) {
  const { address: accountAddress } = useWeb3();
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [transfers, setTransfers] = useState([
    { id: 1, token: "", receiver: "", amount: "" },
  ]);
  const [nextId, setNextId] = useState(2);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const { addBatchTransfer } = useBatchTransferHistory();

  const addTransfer = () => {
    setTransfers([
      ...transfers,
      { id: nextId, token: "", receiver: "", amount: "" },
    ]);
    setNextId(nextId + 1);
  };

  const removeTransfer = (id: number) => {
    if (transfers.length > 1) {
      setTransfers(transfers.filter((t) => t.id !== id));
    }
  };

  const updateTransfer = (id: number, field: string, value: string) => {
    setTransfers(
      transfers.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  // Validation function
  const validateTransfers = () => {
    const errors: string[] = [];

    transfers.forEach((transfer, index) => {
      if (!transfer.token) {
        errors.push(`Transfer ${index + 1}: Please select a token`);
      }
      if (!transfer.receiver) {
        errors.push(`Transfer ${index + 1}: Please enter a receiver address`);
      } else if (!isAddress(transfer.receiver)) {
        errors.push(`Transfer ${index + 1}: Invalid receiver address`);
      }
      if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
        errors.push(`Transfer ${index + 1}: Please enter a valid amount`);
      }
    });

    return errors;
  };

  // Handle review transfer with validation
  const handleReviewTransfer = () => {
    // Validate all transfers before proceeding
    const errors = validateTransfers();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationAlert(true);

      return;
    }

    // Clear any previous validation errors
    setValidationErrors([]);
    setShowValidationAlert(false);

    // If validation passes, open preview dialog
    setIsPreviewDialogOpen(true);
  };

  return (
    <Card className="bg-[#ffffff]/20 text-white backdrop-blur-sm p-8">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1">
            <h3 className="text-2xl font-bold">Gasless Batch Transfer</h3>
            <p className="text-gray-300">
              Send multiple transfers at once without worrying about gas fees
            </p>
          </div>
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group ml-4"
            title="View transfer history"
            onClick={onShowHistory}
          >
            <svg
              className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors duration-200"
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
          </button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {transfers.map((transfer) => (
            <TransferRow
              key={transfer.id}
              accountAddress={accountAddress || ""}
              approvedTokens={approvedTokens}
              removeTransfer={removeTransfer}
              transfer={transfer}
              transfersLength={transfers.length}
              updateTransfer={updateTransfer}
            />
          ))}

          {showValidationAlert && validationErrors.length > 0 && (
            <Alert
              color="warning"
              description={
                <div className="space-y-1">
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              }
              title="Please fix the following errors before proceeding:"
              variant="faded"
              onClose={() => setShowValidationAlert(false)}
            />
          )}

          <div className="flex justify-between items-center">
            <Button
              color="success"
              startContent={<span>+</span>}
              variant="flat"
              onPress={addTransfer}
            >
              Add More
            </Button>

            <Button
              className="font-semibold"
              color="success"
              disabled={parseFloat(credit) <= 0}
              onPress={handleReviewTransfer}
            >
              Review Transfer
            </Button>
          </div>

          {parseFloat(credit) <= 0 && (
            <div className="text-sm text-yellow-400 text-center">
              ⚠️ Please deposit U2U first to enable gasless transactions
            </div>
          )}
        </div>
      </CardBody>

      {/* Transfer Preview Dialog */}
      <TransferPreviewDialog
        approvedTokens={approvedTokens}
        isOpen={isPreviewDialogOpen}
        transfers={transfers}
        onClose={() => setIsPreviewDialogOpen(false)}
        onSubmit={(response) => {
          setIsPreviewDialogOpen(false);

          if (response.success && response.data) {
            setTransactionData(response.data);
            addBatchTransfer({
              id: "random",
              ...response.data,
              transfers,
              creditConsumed: response.data.usdValueConsumed,
            });
            setIsSuccessDialogOpen(true);
          }
        }}
      />

      {/* Transaction Success Dialog */}
      <TransactionSuccessDialog
        isOpen={isSuccessDialogOpen}
        transactionData={transactionData}
        onClose={() => setIsSuccessDialogOpen(false)}
      />
    </Card>
  );
}
