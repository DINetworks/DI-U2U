import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";

import { SwapChainSelectorProps } from "@/types/swap";

export default function SwapChainSelector({
  chain,
  onChainSelect,
  chains,
  label,
  disabled = false,
}: SwapChainSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">{label}</label>

      <Select
        className="w-full"
        classNames={{
          trigger: "bg-white/10 hover:bg-white/20 border-white/20 h-12",
          listbox: "bg-gray-900 border border-gray-700",
          popoverContent: "bg-gray-900 border border-gray-700",
        }}
        disabled={disabled}
        placeholder="Select a chain"
        selectedKeys={chain ? new Set([chain.id]) : new Set()}
        onSelectionChange={(keys) => {
          const selectedId = Array.from(keys)[0] as string;
          const selectedChain = chains.find((c) => c.id === selectedId);

          if (selectedChain) {
            onChainSelect(selectedChain);
          }
        }}
      >
        {chains.map((c) => (
          <SelectItem
            key={c.id}
            classNames={{
              base: "data-[hover=true]:bg-white/10",
            }}
            textValue={`${c.networkName} (${c.nativeCurrency.symbol})`}
          >
            <div className="flex items-center gap-3 py-2">
              <Image
                alt={c.networkName}
                className="rounded-full"
                height={32}
                src={c.chainIconURI}
                width={32}
              />
              <div className="flex-1">
                <div className="font-semibold text-white">{c.networkName}</div>
                <div className="text-sm text-gray-400">
                  {c.nativeCurrency.name} ({c.nativeCurrency.symbol})
                </div>
                {c.isTestnet && (
                  <div className="text-xs text-yellow-400">Testnet</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Chain ID</div>
                <div className="text-sm text-gray-400">{c.chainId}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
