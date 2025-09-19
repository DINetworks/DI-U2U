import { useState, useEffect, useRef, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Slider,
  Image,
} from "@heroui/react";
import { Address, parseUnits } from "viem";

import { useWeb3 } from "@/hooks/useWeb3";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useTokenAllowance } from "@/hooks/useTokenAllowance";
import { normalizeTokenLogoURI } from "@/utils/token";
import { CONTRACT_ADDRESSES } from "@/config/web3";
import { Token } from "@/types/token";
import { DepositDialogProps } from "@/types/component";

export default function DepositDialog({
  isOpen,
  onClose,
  onDeposit,
  onApproveForVault,
  isLoading,
  tokensInChain,
  whitelistedTokens,
}: DepositDialogProps) {
  const { address: accountAddress } = useWeb3();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState<number>(20);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Filter tokens by whitelisted addresses
  const availableTokens = useMemo(() => {
    if (!tokensInChain || !whitelistedTokens) return [];
    const whitelistedSet = new Set(
      whitelistedTokens.map((addr) => addr.toLowerCase()),
    );

    return tokensInChain.filter((token) =>
      whitelistedSet.has(token.address.toLowerCase()),
    );
  }, [tokensInChain, whitelistedTokens]);

  // Get balance for selected token
  const { data: balanceData } = useTokenBalance({
    tokenAddress: selectedToken?.address as Address,
    accountAddress: accountAddress as Address,
    decimals: selectedToken?.decimals || 18,
  });

  // Check allowance for vault contract
  const { data: allowanceData } = useTokenAllowance({
    tokenAddress: selectedToken?.address as Address,
    ownerAddress: accountAddress as Address,
    spenderAddress: CONTRACT_ADDRESSES.CREDIT_VAULT as Address,
  });

  const tokenBalance = balanceData?.formatted || "0";
  const allowance = allowanceData || BigInt(0);
  const depositAmount =
    amount && selectedToken
      ? parseUnits(amount, selectedToken.decimals)
      : BigInt(0);
  const needsApproval =
    selectedToken && depositAmount > 0 && allowance < depositAmount;

  // Use refs to track update sources and prevent circular updates
  const isUpdatingFromSlider = useRef(false);
  const isUpdatingFromInput = useRef(false);

  // Calculate amount based on slider percentage and token balance
  useEffect(() => {
    if (selectedToken && tokenBalance && !isUpdatingFromInput.current) {
      isUpdatingFromSlider.current = true;
      const calculatedAmount = (parseFloat(tokenBalance) * sliderValue) / 100;

      setAmount(calculatedAmount.toFixed(6));
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromSlider.current = false;
      }, 10);
    }
  }, [sliderValue, selectedToken, tokenBalance]);

  // Update slider when amount is manually changed
  useEffect(() => {
    if (
      selectedToken &&
      tokenBalance &&
      amount &&
      !isUpdatingFromSlider.current
    ) {
      isUpdatingFromInput.current = true;
      const percentage = (parseFloat(amount) / parseFloat(tokenBalance)) * 100;

      if (percentage >= 0 && percentage <= 100) {
        setSliderValue(Math.round(percentage));
      }
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromInput.current = false;
      }, 10);
    }
  }, [amount, selectedToken, tokenBalance]);

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSliderValue(20);
      setAmount("");
      setSelectedToken(null);
      setIsApproved(false);
    }
  }, [isOpen]);

  // Reset approval status when token or amount changes
  useEffect(() => {
    if (selectedToken && amount) {
      setIsApproved(false);
    }
  }, [selectedToken, amount]);

  const handleDeposit = async () => {
    if (!selectedToken || !amount || parseFloat(amount) <= 0) return;

    try {
      // If approval is needed and not yet approved
      if (needsApproval && !isApproved && onApproveForVault) {
        setIsApproving(true);
        await onApproveForVault(
          selectedToken.address as Address,
          depositAmount,
        );
        setIsApproving(false);
        setIsApproved(true);

        // Don't proceed with deposit - wait for user to click again
        return;
      }

      // Perform the deposit (either after approval or if no approval needed)
      const amountInWei = parseUnits(amount, selectedToken.decimals);

      await onDeposit(
        selectedToken.address as Address,
        amountInWei,
        selectedToken,
      );
      setAmount("");
      setSelectedToken(null);
      setIsApproved(false); // Reset for next use
      onClose();
    } catch (error) {
      console.error("Transaction failed:", error);
      setIsApproving(false);
      throw error;
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
          <h3 className="text-xl font-bold">Deposit U2U for Gas Credit</h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="deposit-token-select"
            >
              Select Token
            </label>
            <Select
              aria-labelledby="deposit-token-label"
              id="deposit-token-select"
              placeholder="Choose token to deposit"
              selectedKeys={
                selectedToken ? new Set([selectedToken.address]) : new Set()
              }
              onSelectionChange={(keys) => {
                const selectedAddress = Array.from(keys)[0] as string;
                const token = availableTokens.find(
                  (t) => t.address === selectedAddress,
                );

                setSelectedToken(token || null);
              }}
            >
              {availableTokens.map((token) => (
                <SelectItem
                  key={token.address}
                  textValue={`${token.name} (${token.symbol})`}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      alt={token.symbol}
                      className="rounded-full"
                      height={20}
                      src={normalizeTokenLogoURI(token.logoURI)}
                      width={20}
                    />
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-xs text-gray-500">
                        {token.symbol}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="deposit-amount-input"
            >
              Amount
            </label>
            <Input
              aria-labelledby="deposit-amount-label"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {selectedToken ? selectedToken.symbol : ""}
                  </span>
                </div>
              }
              id="deposit-amount-input"
              placeholder="Enter amount"
              type="number"
              value={amount}
              onChange={(e) => {
                isUpdatingFromSlider.current = false;
                setAmount(e.target.value);
              }}
            />
            <div className="space-y-3">
              <Slider
                className="max-w-md mt-3"
                color="foreground"
                label={`${sliderValue}% of balance`}
                marks={[
                  {
                    value: 20,
                    label: "20%",
                  },
                  {
                    value: 50,
                    label: "50%",
                  },
                  {
                    value: 80,
                    label: "80%",
                  },
                ]}
                maxValue={100}
                minValue={0}
                size="sm"
                step={0.1}
                value={sliderValue}
                onChange={(value) => {
                  isUpdatingFromInput.current = false;
                  setSliderValue(value as number);
                }}
              />
              <div className="space-y-2">
                <div className="text-xs text-gray-400">
                  Balance: {tokenBalance}{" "}
                  {selectedToken ? selectedToken.symbol : ""}
                </div>
                {isApproved && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fillRule="evenodd"
                      />
                    </svg>
                    Token approved! Click Deposit to continue.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            💡 Deposit tokens to build up your gas credit balance for gasless
            transactions.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            disabled={!selectedToken || !amount || parseFloat(amount) <= 0}
            isLoading={isLoading || isApproving}
            onPress={handleDeposit}
          >
            {isApproving
              ? "Approving..."
              : isApproved
                ? isLoading
                  ? "Depositing..."
                  : "Deposit"
                : needsApproval
                  ? "Approve & Deposit"
                  : isLoading
                    ? "Depositing..."
                    : "Deposit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
