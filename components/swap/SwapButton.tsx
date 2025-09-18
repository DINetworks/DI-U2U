import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { SwapButtonProps } from '@/types/swap';

export default function SwapButton({
  onClick,
  disabled,
  loading,
  children,
  canGetQuote,
  quote
}: SwapButtonProps) {
  const getButtonText = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <span>Finding best routes...</span>
        </div>
      );
    }

    if (!canGetQuote) {
      return 'Select Token or Amount'
    }

    if (!quote) {
      return "No available route";
    }

    return children || "Exchange Token";
  };

  const getButtonColor = () => {
    if (disabled) return "default";
    if (!quote) return "primary";
    return "success";
  };

  return (
    <Button
      onPress={onClick}
      disabled={disabled}
      color={getButtonColor()}
      size="lg"
      className="w-full h-14 text-lg font-semibold"
      isLoading={loading}
    >
      {getButtonText()}
    </Button>
  );
}