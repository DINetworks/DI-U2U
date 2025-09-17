// Bridge Action Button Component for IU2U Bridge
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { BridgeActionButtonProps } from '@/types/bridge';

export default function BridgeActionButton({
  onClick,
  disabled,
  loading,
  children
}: BridgeActionButtonProps) {
  return (
    <Button
      color="success"
      onPress={onClick}
      disabled={disabled || loading}
      className="w-full"
      size="lg"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" color="white" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}