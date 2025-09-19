import { Button } from "@heroui/button";

import { SwapButtonProps } from "@/types/swap";

export default function SwapButton({
  onClick,
  disabled,
  loading,
  children,
  canGetQuote,
  quote,
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
      return "Select Token or Amount";
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
      className="w-full h-14 text-lg font-semibold"
      color={getButtonColor()}
      disabled={disabled}
      isLoading={loading}
      size="lg"
      onPress={onClick}
    >
      {getButtonText()}
    </Button>
  );
}
