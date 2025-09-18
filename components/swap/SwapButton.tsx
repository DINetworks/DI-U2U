import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { SwapButtonProps } from '@/types/swap';

export default function SwapButton({
  onClick,
  disabled,
  loading,
  children,
  quote
}: SwapButtonProps) {
  const getButtonText = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Spinner size="sm" color="white" />
          <span>Processing...</span>
        </div>
      );
    }

    if (!quote) {
      return "Get Quote";
    }

    return children || "Swap Tokens";
  };

  const getButtonColor = () => {
    if (!quote) return "primary";
    if (disabled) return "default";
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