import { motion } from 'framer-motion';
import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { SwapToken, SwapChain } from '@/types/swap';
import { normalizeTokenLogoURI } from '@/utils/token';

interface TokenChainSelectorProps {
  label: string;
  token: SwapToken | null;
  chain: SwapChain | null;
  balance?: string;
  onClick: () => void;
  animationDelay?: number;
}

export default function TokenChainSelector({
  label,
  token,
  chain,
  balance,
  onClick,
  animationDelay = 0
}: TokenChainSelectorProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-white">{label}</label>
      <Card className="bg-black/80 backdrop-blur-sm cursor-pointer hover:bg-black/90 transition-colors">
        <CardBody className="p-4 h-18 justify-center">
          <div
            className="flex items-center justify-between"
            onClick={onClick}
          >
            <div className="flex items-center gap-3">
              {/* Chain Icon */}
              {chain && (
                <Image
                  src={chain.chainIconURI}
                  alt={chain.networkName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}

              {/* Token Info */}
              <div className="flex items-center gap-2">
                {token ? (
                  <>
                    <Image
                      src={normalizeTokenLogoURI(token.logoURI)}
                      alt={token.symbol}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-white">Select Token</div>
                )}
              </div>
            </div>

            {/* Balance */}
            {balance && token && (
              <div className="text-right">
                <div className="text-xs text-gray-400">Balance</div>
                <div className="text-sm font-medium text-white">
                  {parseFloat(balance).toFixed(6)}
                </div>
              </div>
            )}

            {/* Right Arrow Icon */}
            <div className="text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}