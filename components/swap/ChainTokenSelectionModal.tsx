import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Image } from '@heroui/image';
import { SwapToken, SwapChain } from '@/types/swap';
import { normalizeTokenLogoURI } from '@/utils/token';

interface ChainTokenSelectionModalProps {
  selectionType: 'source' | 'destination';
  chains: SwapChain[];
  tokens: SwapToken[];
  selectedChain: SwapChain | null;
  chainSearch: string;
  tokenSearch: string;
  onChainSearchChange: (value: string) => void;
  onTokenSearchChange: (value: string) => void;
  onChainClick: (chain: SwapChain) => void;
  onTokenSelect: (token: SwapToken, chain: SwapChain) => void;
  onCancel: () => void;
}

export default function ChainTokenSelectionModal({
  selectionType,
  chains,
  tokens,
  selectedChain,
  chainSearch,
  tokenSearch,
  onChainSearchChange,
  onTokenSearchChange,
  onChainClick,
  onTokenSelect,
  onCancel
}: ChainTokenSelectionModalProps) {
  // Filter chains based on search
  const filteredChains = chains.filter(chain =>
    chain.networkName.toLowerCase().includes(chainSearch.toLowerCase()) ||
    chain.nativeCurrency.symbol.toLowerCase().includes(chainSearch.toLowerCase())
  );

  // Filter tokens based on selected chain and search
  const availableTokens = selectedChain
    ? tokens.filter(token =>
        token.chainId.toString() === selectedChain.id &&
        (token.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
         token.name.toLowerCase().includes(tokenSearch.toLowerCase()))
      )
    : [];

  return (
    <motion.div
      key="selection-interface"
      initial={{ opacity: 0, x: 20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.98 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { duration: 0.3 }
      }}
    >
      <div className="p-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-white">
            Select {selectionType === 'source' ? 'Source' : 'Destination'} Token & Chain
          </h3>
          <Button
            size="sm"
            variant="flat"
            color="warning"
            onPress={onCancel}
          >
            Cancel
          </Button>
        </motion.div>

        {/* Selection Interface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chains Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h4 className="text-sm font-medium text-white mb-3">Select Chain</h4>

            {/* Chain Search */}
            <Input
              placeholder="Search chains..."
              value={chainSearch}
              onChange={(e) => onChainSearchChange(e.target.value)}
              className="mb-4"
              classNames={{
                input: "bg-white/10 text-white placeholder-gray-400",
                inputWrapper: "bg-white/10 border-white/20"
              }}
            />

            {/* Chains List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => onChainClick(chain)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedChain?.id === chain.id
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Image
                    src={chain.chainIconURI}
                    alt={chain.networkName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-medium text-white">{chain.networkName}</div>
                    <div className="text-sm text-gray-400">
                      {chain.nativeCurrency.symbol}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tokens Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h4 className="text-sm font-medium text-white mb-3">
              {selectedChain ? `Tokens on ${selectedChain.networkName}` : 'Select a chain first'}
            </h4>

            {/* Token Search */}
            <Input
              placeholder="Search tokens..."
              value={tokenSearch}
              onChange={(e) => onTokenSearchChange(e.target.value)}
              disabled={!selectedChain}
              className="mb-4"
              classNames={{
                input: "bg-white/10 text-white placeholder-gray-400",
                inputWrapper: "bg-white/10 border-white/20"
              }}
            />

            {/* Tokens List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {selectedChain ? (
                availableTokens.length > 0 ? (
                  availableTokens.map((token) => (
                    <button
                      key={token.address}
                      onClick={() => onTokenSelect(token, selectedChain)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Image
                        src={normalizeTokenLogoURI(token.logoURI)}
                        alt={token.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="text-left flex-1">
                        <div className="font-medium text-white">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          ${token.usdPrice?.toFixed(4) || 'N/A'}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No tokens found
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Select a chain to view tokens
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}