import { motion } from 'framer-motion';
import { Card, CardBody } from '@heroui/card';

interface FeesProps {
  totalCost: string;
  gasCost: string;
  bridgeFee: string;
  currency: string;
  onClick: () => void;
  animationDelay?: number;
}

export default function Fees({
  totalCost,
  gasCost,
  bridgeFee,
  currency,
  onClick,
  animationDelay = 0
}: FeesProps) {
  const formatCost = (cost: string) => {
    const value = parseFloat(cost);
    if (value < 0.01) {
      return `< 0.01`;
    }
    return value.toFixed(4);
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
              {/* Money Icon */}
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>

              {/* Cost Info */}
              <div>
                <div className="text-white font-medium text-sm">
                  {formatCost(totalCost)} {currency}
                </div>
                <div className="text-gray-400 text-xs">
                  Gas: {formatCost(gasCost)} • Bridge: {formatCost(bridgeFee)}
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