import { isAddress } from "viem";
import { useEffect, useState } from "react";

import { TransferRowProps } from "@/types/metatx";
import { normalizeTokenLogoURI } from "@/utils/token";
import { formatSmallNumber } from "@/utils/number";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { Button, Image, Input, Select, SelectItem } from "@heroui/react";

// TransferRow component with balance and validation (moved outside to prevent re-creation)
export default function TransferRow({ transfer, approvedTokens, accountAddress, updateTransfer, removeTransfer, transfersLength }: TransferRowProps) {
  const selectedToken = approvedTokens?.find(token => token.address === transfer.token);

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
    const insufficient = !!(selectedToken && amountValue > 0 && amountValue > balanceValue);
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
          <label id={`token-label-${transfer.id}`} className="block text-sm font-medium mb-2">Token</label>
          <Select
            placeholder="Select approved token"
            selectedKeys={transfer.token ? new Set([transfer.token]) : new Set()}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              updateTransfer(transfer.id, 'token', selected || '');
            }}
            className="w-full"
            aria-labelledby={`token-label-${transfer.id}`}
          >
            {approvedTokens.map((token) => (
              <SelectItem key={token.address} textValue={`${token.name} (${token.symbol})`}>
                <div className="flex items-center gap-2">
                  <Image
                    src={normalizeTokenLogoURI(token.logoURI)}
                    alt={token.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
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
          <label id={`receiver-label-${transfer.id}`} className="block text-sm font-medium mb-2">Receiver Address</label>
          <div className="space-y-1">
            <Input
              placeholder="0x..."
              value={transfer.receiver}
              onChange={(e) => updateTransfer(transfer.id, 'receiver', e.target.value)}
              onBlur={handleReceiverBlur}
              className="w-full"
              aria-labelledby={`receiver-label-${transfer.id}`}
              isInvalid={isInvalidAddress}
            />
            {isInvalidAddress && (
              <div className="text-xs text-red-400">Invalid address format</div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label id={`amount-label-${transfer.id}`} className="block text-sm font-medium mb-2">Amount</label>
          <div className="space-y-1">
            <Input
              placeholder="0.00"
              type="number"
              value={transfer.amount}
              onChange={(e) => updateTransfer(transfer.id, 'amount', e.target.value)}
              onBlur={handleAmountBlur}
              className="w-full"
              aria-labelledby={`amount-label-${transfer.id}`}
              isInvalid={hasInsufficientBalance}
            />
            {selectedToken && (
              <div className="text-xs text-gray-400">
                Balance: <span dangerouslySetInnerHTML={{ __html: formattedBalance }} /> {selectedToken.symbol}
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
              color="warning"
              variant="flat"
              size="sm"
              onPress={() => removeTransfer(transfer.id)}
              className="rounded-full min-w-unit-10 w-10 h-10 mt-8"
            >
              -
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};