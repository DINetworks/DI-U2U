import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import { formatEther, parseUnits, encodeFunctionData, isAddress } from "viem";
import { erc20Abi } from "viem";
import { Image } from "@heroui/image";

import { useWeb3 } from "@/hooks/useWeb3";
import { useGaslessContracts } from "@/hooks/useGaslessContracts";
import { normalizeTokenLogoURI } from "@/utils/token";
import { Transfer, TransferPreviewDialogProps } from "@/types/metatx";

const METATX_DEADLINE = 600; // 10 minutes

export default function TransferPreviewDialog({
  isOpen,
  onClose,
  transfers,
  approvedTokens,
  onSubmit,
}: TransferPreviewDialogProps) {
  const { address } = useWeb3();
  const { gatewayContract } = useGaslessContracts();

  const [signature, setSignature] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [isPending, setPending] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [validationState, setValidationState] = useState<
    Record<number, boolean>
  >({});

  // Get token info helper
  const getTokenInfo = useCallback(
    (address: string) =>
      approvedTokens?.find((token) => token.address === address),
    [approvedTokens],
  );

  // Encode transfer item
  const encodeTransferItem = useCallback(
    (transfer: Transfer) => {
      const tokenData = getTokenInfo(transfer.token);

      if (!tokenData?.decimals) return null;

      // Validate required fields
      if (!transfer.token || !transfer.receiver || !transfer.amount)
        return null;
      if (!isAddress(transfer.receiver)) return null;

      const amount = parseUnits(transfer.amount.toString(), tokenData.decimals);
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transferFrom",
        args: [
          address as `0x${string}`,
          transfer.receiver as `0x${string}`,
          amount,
        ],
      });

      return { to: transfer.token, value: BigInt(0), data };
    },
    [getTokenInfo, address],
  );

  // Create meta transactions
  const metaTxs = useMemo(() => {
    return transfers.map(encodeTransferItem).filter(Boolean);
  }, [transfers, encodeTransferItem]);

  // Check if signature is expired
  useEffect(() => {
    if (deadline && Date.now() / 1000 > deadline) {
      setIsExpired(true);
    }
  }, [deadline]);

  // Query enabled condition
  const queryEnabled =
    isOpen &&
    !!metaTxs?.length &&
    !!signature &&
    !!deadline &&
    !isExpired &&
    !!gatewayContract &&
    !isPending &&
    !txHash;

  // Estimate transfer query
  const {
    data: estimatedInformation,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["estimateCredit", signature, deadline],
    queryFn: async () => {
      try {
        const estimatedInfo = await gatewayContract!.estimateTransfer({
          metaTxs,
          signature,
          deadline: deadline,
        });

        return estimatedInfo;
      } catch (error) {
        console.error("Estimation error:", error);
        throw error;
      }
    },
    enabled: queryEnabled,
    refetchInterval: 15000,
    staleTime: 10000,
  });

  // Extract estimation data
  const estimationData = useMemo(() => {
    if (!estimatedInformation?.success || !estimatedInformation?.data)
      return null;

    return estimatedInformation.data;
  }, [estimatedInformation]);

  const hasEnoughCredits = estimationData?.hasEnoughCredits ?? true;

  // Check if can submit
  const canSubmit = useMemo(() => {
    if (!address || !transfers.length) return false;
    if (!signature || isExpired) return false;
    if (!hasEnoughCredits) return false;
    if (!estimationData) return false;
    if (isPending) return false;
    if (txHash) return false;

    return true;
  }, [
    address,
    transfers,
    signature,
    isExpired,
    estimationData,
    hasEnoughCredits,
    isPending,
    txHash,
  ]);

  // Auto-sign when dialog opens and conditions are met
  useEffect(() => {
    if (
      !gatewayContract ||
      !metaTxs?.length ||
      !isOpen ||
      isGeneratingSignature ||
      signature
    ) {
      return;
    }

    handleSign();
  }, [gatewayContract, isOpen, metaTxs, signature, isGeneratingSignature]);

  // Handle signing
  const handleSign = useCallback(async () => {
    try {
      setIsGeneratingSignature(true);
      setTxHash("");
      setSignature("");

      const _deadline = Math.floor(Date.now() / 1000) + METATX_DEADLINE;

      setDeadline(_deadline);
      setIsExpired(false);

      const _signature = await gatewayContract!.generateEIP712Signature({
        metaTxs,
        deadline: _deadline,
      });

      setSignature(_signature);
    } catch (error) {
    } finally {
      setIsGeneratingSignature(false);
    }
  }, [gatewayContract, metaTxs]);

  // Validate all transfers on submit
  const validateAllTransfers = () => {
    const newValidationState: Record<number, boolean> = {};

    transfers.forEach((transfer) => {
      newValidationState[transfer.id] = !!(
        transfer.receiver && !isAddress(transfer.receiver)
      );
    });
    setValidationState(newValidationState);

    return newValidationState;
  };

  // Handle submit
  const handleSubmit = useCallback(async () => {
    try {
      if (!canSubmit) return;

      // Validate all transfers before submission
      const validationResults = validateAllTransfers();
      const hasInvalidAddresses = Object.values(validationResults).some(
        (invalid) => invalid,
      );

      if (hasInvalidAddresses) {
        alert("Please fix the invalid addresses before submitting.");

        return;
      }

      setPending(true);
      setTxHash("");

      const response = await gatewayContract!.relayErc20BatchTransfers({
        metaTxs,
        signature,
        deadline: deadline,
      });

      if (response.success && response.data) {
        setTxHash(response.data.txHash);
        onSubmit(response);
        onClose();
      } else {
        throw new Error("Transaction failed or invalid response");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(`Transaction failed: ${error?.message || error}`);
    } finally {
      setPending(false);
    }
  }, [
    canSubmit,
    gatewayContract,
    metaTxs,
    deadline,
    signature,
    onSubmit,
    onClose,
    validateAllTransfers,
  ]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSignature("");
      setDeadline(0);
      setIsExpired(false);
      setPending(false);
      setTxHash("");
      setValidationState({});
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="blur"
      className="p-4"
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Transfer Preview</h3>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Transfer Items (Read-only) */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Transfer Details</h4>
            {transfers.map((transfer) => {
              const tokenInfo = getTokenInfo(transfer.token);

              return (
                <Card key={transfer.id} className="bg-gray-50 dark:bg-gray-800">
                  <CardBody className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tokenInfo && (
                          <Image
                            alt={tokenInfo.symbol}
                            className="rounded-full"
                            height={32}
                            src={normalizeTokenLogoURI(tokenInfo.logoURI)}
                            width={32}
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {tokenInfo?.name || "Unknown Token"} (
                            {tokenInfo?.symbol || "UNK"})
                          </div>
                          <div className="text-sm text-gray-500">
                            {transfer.amount} {tokenInfo?.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">To</div>
                        <div className="font-mono text-sm">
                          {transfer.receiver ? (
                            validationState[transfer.id] ? (
                              <span className="text-red-400">
                                {transfer.receiver.slice(0, 6)}...
                                {transfer.receiver.slice(-4)} (Invalid)
                              </span>
                            ) : (
                              `${transfer.receiver.slice(0, 6)}...${transfer.receiver.slice(-4)}`
                            )
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Estimation Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Cost Estimation</h4>

            {isLoading || isFetching ? (
              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardBody className="py-6">
                  <div className="flex items-center justify-center gap-3">
                    <Spinner size="sm" />
                    <span>Estimating transaction costs...</span>
                  </div>
                </CardBody>
              </Card>
            ) : estimationData ? (
              <Card className="bg-green-50 dark:bg-green-900/20">
                <CardBody className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Required Credits
                      </div>
                      <div className="font-semibold">
                        {formatEther(BigInt(estimationData.requiredCredits))}{" "}
                        U2U
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Your Credits</div>
                      <div className="font-semibold">
                        {formatEther(BigInt(estimationData.userCredits))} U2U
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Gas Cost (USD)
                      </div>
                      <div className="font-semibold">
                        ${estimationData.breakdown.gasCostUsd}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Total Cost (USD)
                      </div>
                      <div className="font-semibold">
                        ${estimationData.totalUsdCost}
                      </div>
                    </div>
                  </div>

                  {!hasEnoughCredits && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      ⚠️ Insufficient credits. You need{" "}
                      {formatEther(BigInt(estimationData.creditDeficit))} more
                      U2U credits.
                    </div>
                  )}
                </CardBody>
              </Card>
            ) : (
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardBody className="py-6">
                  <div className="text-center text-gray-500">
                    {isGeneratingSignature ? (
                      <div className="flex items-center justify-center gap-3">
                        <Spinner size="sm" />
                        <span>Preparing signature...</span>
                      </div>
                    ) : (
                      "Preparing estimation..."
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button disabled={isPending} variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            disabled={!canSubmit}
            isLoading={isPending}
            onPress={handleSubmit}
          >
            {isPending ? "Submitting..." : "Confirm Transfer"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
