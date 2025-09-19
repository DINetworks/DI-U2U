import { isAddress } from "viem";
import { useEffect, useState } from "react";
import { Button, Image, Input, Select, SelectItem } from "@heroui/react";

import { TransferRowProps } from "@/types/metatx";
import { normalizeTokenLogoURI } from "@/utils/token";
import { formatSmallNumber } from "@/utils/number";
import { useTokenBalance } from "@/hooks/useTokenBalance";

// TransferRow component with balance and validation (moved outside to prevent re-creation)
export default function TransferRow({
  transfer,
  approvedTokens,
  accountAddress,
  updateTransfer,
  removeTransfer,
  transfersLength,
}: TransferRowProps) {
  const selectedToken = approvedTokens?.find(
    (token) => token.address === transfer.token,
  );

  // Get balance for selected token
  const { data: balanceData } = useTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    accountAddress: accountAddress as `0x${string}`,
    decimals: selectedToken?.decimals || 18,
  });

  const tokenBalance = balanceData?.formatted || "0";
  const formattedBalance = formatSmallNumber(tokenBalance);

  // Validation state (only updated on blur or review)
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);
  const [isInvalidAddress, setIsInvalidAddress] = useState(false);

  // Validate on blur
  const handleAmountBlur = () => {
    const amountValue = parseFloat(transfer.amount || "0");
    const balanceValue = parseFloat(tokenBalance);
    const insufficient = !!(
      selectedToken &&
      amountValue > 0 &&
      amountValue > balanceValue
    );

    setHasInsufficientBalance(insufficient);
  };

  const handleReceiverBlur = () => {
    const invalid = !!(transfer.receiver && !isAddress(transfer.receiver));

    setIsInvalidAddress(invalid);
  };

  // Reset validation when token changes (but not on every amount/receiver change)
  useEffect(() => {
    setHasInsufficientBalance(false);
  }, [selectedToken]);

  useEffect(() => {
    setIsInvalidAddress(false);
  }, []);

  return (
    <div className="relative">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor={`token-select-${transfer.id}`}
          >
            Token
          </label>
          <Select
            aria-labelledby={`token-label-${transfer.id}`}
            className="w-full"
            id={`token-select-${transfer.id}`}
            placeholder="Select approved token"
            selectedKeys={
              transfer.token ? new Set([transfer.token]) : new Set()
            }
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;

              updateTransfer(transfer.id, "token", selected || "");
            }}
          >
            {approvedTokens.map((token) => (
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
                    <div className="text-xs text-gray-500">{token.symbol}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor={`receiver-input-${transfer.id}`}
          >
            Receiver Address
          </label>
          <div className="space-y-1">
            <Input
              aria-labelledby={`receiver-label-${transfer.id}`}
              className="w-full"
              id={`receiver-input-${transfer.id}`}
              isInvalid={isInvalidAddress}
              placeholder="0x..."
              value={transfer.receiver}
              onBlur={handleReceiverBlur}
              onChange={(e) =>
                updateTransfer(transfer.id, "receiver", e.target.value)
              }
            />
            {isInvalidAddress && (
              <div className="text-xs text-red-400">Invalid address format</div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor={`amount-input-${transfer.id}`}
          >
            Amount
          </label>
          <div className="space-y-1">
            <Input
              aria-labelledby={`amount-label-${transfer.id}`}
              className="w-full"
              id={`amount-input-${transfer.id}`}
              isInvalid={hasInsufficientBalance}
              placeholder="0.00"
              type="number"
              value={transfer.amount}
              onBlur={handleAmountBlur}
              onChange={(e) =>
                updateTransfer(transfer.id, "amount", e.target.value)
              }
            />
            {selectedToken && (
              <div className="text-xs text-gray-400">
                Balance:{" "}
                <span dangerouslySetInnerHTML={{ __html: formattedBalance }} />{" "}
                {selectedToken.symbol}
              </div>
            )}
            {hasInsufficientBalance && (
              <div className="text-xs text-red-400">Insufficient balance</div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {transfersLength > 1 && (
            <Button
              isIconOnly
              className="rounded-full min-w-unit-10 w-10 h-10 mt-8"
              color="warning"
              size="sm"
              variant="flat"
              onPress={() => removeTransfer(transfer.id)}
            >
              -
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
