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
  onClick: () => void;
  animationDelay?: number;
}

export default function TokenChainSelector({
  label,
  token,
  chain,
  balance,
  onClick,
  animationDelay = 0,
}: TokenChainSelectorProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-white">{label}</label>
      <Card className="bg-black/80 backdrop-blur-sm cursor-pointer hover:bg-black/90 transition-colors">
        <CardBody className="p-4 h-18 justify-center">
          <div
            className="flex items-center justify-between"
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }}
          >
            <div className="flex items-center gap-3">
              {/* Chain Icon */}
              {chain && (
                <Image
                  alt={chain.networkName}
                  className="rounded-full"
                  height={32}
                  src={chain.chainIconURI}
                  width={32}
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
