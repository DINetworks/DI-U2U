import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';

interface PoolFiltersProps {
  categories: { key: string; label: string }[];
  selectedCategory: string;
  selectedChain: string;
  selectedProtocol: string;
  searchQuery: string;
  chains: { key: string; label: string }[];
  protocols: { key: string; label: string }[];
  onCategoryChange: (category: string) => void;
  onChainChange: (chain: string) => void;
  onProtocolChange: (protocol: string) => void;
  onSearchChange: (query: string) => void;
}

export default function PoolFilters({
  categories,
  selectedCategory,
  selectedChain,
  selectedProtocol,
  searchQuery,
  chains,
  protocols,
  onCategoryChange,
  onChainChange,
  onProtocolChange,
  onSearchChange,
}: PoolFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? "solid" : "flat"}
            color={selectedCategory === category.key ? "success" : "default"}
            onPress={() => onCategoryChange(category.key)}
            className="text-sm"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chain Filter */}
        <Select
          placeholder="Select Chain"
          selectedKeys={new Set([selectedChain])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onChainChange(selected);
          }}
        >
          {chains.map((chain) => (
            <SelectItem key={chain.key}>
              {chain.label}
            </SelectItem>
          ))}
        </Select>

        {/* Protocol Filter */}
        <Select
          placeholder="Select Protocol"
          selectedKeys={new Set([selectedProtocol])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            onProtocolChange(selected);
          }}
        >
          {protocols.map((protocol) => (
            <SelectItem key={protocol.key}>
              {protocol.label}
            </SelectItem>
          ))}
        </Select>

        {/* Search */}
        <Input
          placeholder="Search by token symbol or address"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          startContent={
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}