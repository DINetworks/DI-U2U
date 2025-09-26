import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

import { SwapToken, SwapChain } from "@/types/swap";
import { normalizeTokenLogoURI } from "@/utils/token";

interface TokenChainSelectorProps {
  label: string;
  token: SwapToken | null;
  chain: SwapChain | null;
  balance?: string;
  amount?: string;
  onClick: () => void;
  setAmount: (result: string) => void;
  animationDelay?: number;
}

export default function TokenChainSelector({
  label,
  token,
  chain,
  balance,
  onClick,
  amount,
  setAmount,
  animationDelay = 0,
}: TokenChainSelectorProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${label == 'To' ? '-mt-6' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
    >      
      <Card className="bg-black/90 backdrop-blur-sm cursor-pointer hover:bg-black/80 transition-colors">
        <CardBody className="px-6 py-4 justify-center space-y-2">
          <label className="block text-xs font-medium text-gray-400">{label}</label>
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 flex-2" 
              role="button"
              tabIndex={0}
              onClick={onClick}>
              {/* Chain Icon */}
              {chain && (
                <Image
                  alt={chain.networkName}
                  className="rounded-full"
                  height={28}
                  src={chain.chainIconURI}
                  width={28}
                />
              )}

              {/* Token Info */}
              <div className="flex items-center gap-2">
                {token ? (
                  <>
                    <Image
                      alt={token.symbol}
                      className="rounded-full"
                      height={36}
                      src={normalizeTokenLogoURI(token.logoURI)}
                      width={36}
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-white">Select Token</div>
                )}
              </div>
            </div>

            {/* Right Arrow Icon */}
            <div className="text-gray-400 flex-3">
              <input
                className="w-full p-3 bg-transparent border border-transparent rounded-2xl text-white text-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-transparent"
                placeholder="0.00"
                readOnly={label == 'to'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* Balance */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400">Balance: </div>
              <div className="text-sm font-medium text-gray-300">
                {token && balance? parseFloat(balance).toFixed(6) : '--'}
              </div>
            </div>
            
            {/* Balance */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-300">
                {token && balance? '$20.05' : '$0.00'}
              </div>
            </div>
            
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
