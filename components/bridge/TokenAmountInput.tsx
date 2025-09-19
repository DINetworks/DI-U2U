// Token Amount Input Component for IU2U Bridge
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { TokenAmountInputProps } from "@/types/bridge";

export default function TokenAmountInput({
  amount,
  onAmountChange,
  balance,
  symbol,
  maxAmount,
  disabled = false,
  label,
}: TokenAmountInputProps) {
  const handleMaxClick = () => {
    if (maxAmount) {
      onAmountChange(maxAmount);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white">
        {label || `Amount (${symbol})`}
      </label>
      <div className="relative">
        <Input
          className="pr-20"
          disabled={disabled}
          endContent={
            <div className="flex items-center gap-2">
              <Button
                className="h-6 px-2 text-xs"
                disabled={disabled || !maxAmount}
                size="sm"
                variant="flat"
                onPress={handleMaxClick}
              >
                MAX
              </Button>
              <span className="text-gray-400 text-sm">{symbol}</span>
            </div>
          }
          placeholder="0.00"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>

      {balance && (
        <div className="text-xs text-gray-400 mt-1">
          Balance: {balance} {symbol}
          {maxAmount && maxAmount !== balance && (
            <span className="ml-2 text-blue-400">
              (Max: {maxAmount} {symbol})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
