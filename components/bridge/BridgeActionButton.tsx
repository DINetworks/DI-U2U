// Bridge Action Button Component for IU2U Bridge
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { BridgeActionButtonProps } from "@/types/bridge";

export default function BridgeActionButton({
  onClick,
  disabled,
  loading,
  children,
}: BridgeActionButtonProps) {
  return (
    <Button
      className="w-full"
      color="success"
      disabled={disabled || loading}
      size="lg"
      onPress={onClick}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner color="white" size="sm" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
