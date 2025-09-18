import { motion } from 'framer-motion';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { CrossChainRoute } from '@/types/swap';

interface SwapRoutesProps {
  route: CrossChainRoute;
  onClick: () => void;
  animationDelay?: number;
}

export default function SwapRoutes({ route, onClick, animationDelay = 0 }: SwapRoutesProps) {
  // Mock DEX and bridge icons - in real app, these would come from route data
  const dexIcons = [
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    'https://assets.coingecko.com/coins/images/325/small/Tether.png'
  ];

  const bridgeIcons = [
    'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png'
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
    >
      <Card className="bg-black/80 backdrop-blur-sm cursor-pointer hover:bg-black/90 transition-colors">
        <CardBody className="p-4">
          <div
            className="flex items-center justify-between"
            onClick={onClick}
          >
            <div className="flex items-center gap-3">
              {/* Stacked DEX and Bridge Icons */}
              <div className="flex items-center">
                {/* DEX Icons */}
                {dexIcons.slice(0, 2).map((icon, index) => (
                  <div
                    key={`dex-${index}`}
                    className="w-6 h-6 rounded-full border-2 border-black/80 -ml-1 first:ml-0"
                    style={{ zIndex: dexIcons.length - index }}
                  >
                    <img
                      src={icon}
                      alt={`DEX ${index + 1}`}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                ))}

                {/* Bridge Icon */}
                {bridgeIcons.length > 0 && (
                  <div className="w-6 h-6 rounded-full border-2 border-black/80 -ml-1">
                    <img
                      src={bridgeIcons[0]}
                      alt="Bridge"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                )}

                {/* More indicator */}
                {(dexIcons.length > 2 || bridgeIcons.length > 1) && (
                  <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-black/80 -ml-1 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      +{(dexIcons.length - 2) + (bridgeIcons.length - 1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Route Info */}
              <div className="flex items-center gap-2">
                <div className="text-white font-medium text-sm">
                  {dexIcons.length + bridgeIcons.length} Steps
                </div>

                {/* Clock Icon with Time */}
                <div className="flex items-center gap-1 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path strokeWidth={2} d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-sm">{formatTime(route.estimatedTime)}</span>
                </div>
              </div>
            </div>

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