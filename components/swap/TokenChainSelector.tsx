import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

import { SwapToken, SwapChain } from "@/types/swap";
import { normalizeTokenLogoURI } from "@/utils/token";
import { useMemo } from "react";
import { Button } from "@heroui/react";

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

  const tokenInUsd = useMemo(() => {
    if (amount && token?.usdPrice) {
      return parseFloat(amount) * token.usdPrice;
    }

    return 0;
  }, [amount, token]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${label == "To" ? "-mt-4" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
    >
      <Card className="bg-black/90 backdrop-blur-sm transition-colors">
        <CardBody className="px-6 py-4 justify-center space-y-2">
          <label className="block text-xs font-medium text-gray-400">
            {label}
          </label>
          <div className="flex items-center justify-between gap-6">
            <div className="flex-2">
              <div
                className="flex items-center gap-3 h-16 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer p-3"
                role="button"
                tabIndex={0}
                onClick={onClick}
              >
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
                        <div className="text-xs text-gray-400">
                          {token.name}
                        </div>
                      </div>
                    </>
                  ) : (
                    "Select Token"
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-400 justify-between mt-2 mr-2">
                {token ? "1" : " "} {token?.symbol} ~ $
                {token?.usdPrice?.toFixed(4) || "--"}
              </div>
            </div>

            {/* Right Arrow Icon */}
            <div className="flex-3">
              <div className="text-gray-400">
                {label == "From" ? (
                  <input
                    className="w-full p-4 bg-transparent border border-white/5 bg-white/5 rounded-lg text-2xl text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/15"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                ) : (
                  <div className="w-full p-4 bg-transparent border border-white/5 bg-white/5 rounded-lg text-2xl text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/15">
                    {amount || "0.00"}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                {/* Balance */}
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400">Balance: </div>
                  <div className="text-xs font-medium text-gray-400">
                    {token && balance ? parseFloat(balance).toFixed(6) : "--"}
                  </div>

                  <div
                    className="text-xs font-medium text-success-500 cursor-pointer"
                    onClick={() => setAmount(balance || "")}
                  >
                    Max
                  </div>
                </div>

                {/* Usd Vaule */}
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-400">
                    {`${tokenInUsd < 0.01 ? '< $0.01' :  '$' + tokenInUsd.toFixed(3)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
