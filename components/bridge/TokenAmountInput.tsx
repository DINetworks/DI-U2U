// Token Amount Input Component for IU2U Bridge
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { TokenAmountInputProps } from '@/types/bridge';

export default function TokenAmountInput({
  amount,
  onAmountChange,
  balance,
  symbol,
  maxAmount,
  disabled = false
}: TokenAmountInputProps) {
  const handleMaxClick = () => {
    if (maxAmount) {
      onAmountChange(maxAmount);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white">
        Amount ({symbol})
      </label>
      <div className="relative">
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          disabled={disabled}
          className="pr-20"
          endContent={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={handleMaxClick}
                disabled={disabled || !maxAmount}
                className="h-6 px-2 text-xs"
              >
                MAX
              </Button>
              <span className="text-gray-400 text-sm">{symbol}</span>
            </div>
          }
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