// Address Input Component for IU2U Bridge
import { Input } from '@heroui/input';
import { isAddress } from 'viem';
import { AddressInputProps } from '@/types/bridge';

export default function AddressInput({
  address,
  onAddressChange,
  label,
  placeholder,
  error,
  disabled = false
}: AddressInputProps) {
  const isValidAddress = address ? isAddress(address as `0x${string}`) : true;
  const hasError = error || (address && !isValidAddress);

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white">
        {label}
      </label>
      <Input
        type="text"
        placeholder={placeholder}
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        disabled={disabled}
        isInvalid={!!hasError}
        className="w-full"
      />

      {hasError && (
        <div className="text-xs text-red-400 mt-1">
          {error || 'Invalid address format'}
        </div>
      )}

      {address && isValidAddress && (
        <div className="text-xs text-green-400 mt-1">
          ✓ Valid address format
        </div>
      )}
    </div>
  );
}