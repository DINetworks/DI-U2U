// Chain Selector Component for IU2U Bridge
import { Select, SelectItem } from '@heroui/select';
import { ChainSelectorProps } from '@/types/bridge';
import { getChainLogo } from '@/config/chains';
import { Image } from '@heroui/image';

export default function ChainSelector({
  chains,
  selectedChain,
  onChainSelect,
  label,
  disabled = false
}: ChainSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-white">
        {label}
      </label>
      <Select
        placeholder="Select a chain"
        selectedKeys={selectedChain ? new Set([selectedChain.id.toString()]) : new Set()}
        onSelectionChange={(keys) => {
          const selectedId = Array.from(keys)[0] as string;
          const chain = chains.find(c => c.id.toString() === selectedId);
          if (chain) {
            onChainSelect(chain);
          }
        }}
        disabled={disabled}
        className="w-full"
      >
        {chains.map((chain) => (
          <SelectItem
            key={chain.id.toString()}
            textValue={`${chain.name} (${chain.nativeCurrency.symbol})`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={getChainLogo(chain.id)}
                alt={chain.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{chain.name}</div>
                <div className="text-xs text-gray-500">
                  {chain.nativeCurrency.name} ({chain.nativeCurrency.symbol})
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}