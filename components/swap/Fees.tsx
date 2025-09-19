import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";

interface FeesProps {
  totalCost: string;
  currency: string;
  onClick: () => void;
  animationDelay?: number;
}

export default function Fees({
  totalCost,
  currency,
  onClick,
  animationDelay = 0,
}: FeesProps) {
  const formatCost = (cost: string) => {
    const value = parseFloat(cost);

    if (value < 0.01) {
      return `< 0.01`;
    }

    return value.toFixed(2);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex-1"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: animationDelay, duration: 0.3 }}
    >
      <Card className="bg-white/10 cursor-pointer hover:bg-white/20 border border-white/20">
        <CardBody className="p-3">
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
              {/* Money Icon */}
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>

              {/* Cost Info */}
              <div>
                <div className="text-gray-300 font-medium text-sm">
                  Gas:{formatCost(totalCost)} {currency}
                </div>
                {/* <div className="text-gray-400 text-xs">
                  Gas: {formatCost(gasCost)} • Bridge: {formatCost(bridgeFee)}
                </div> */}
              </div>
            </div>

            {/* Right Arrow Icon */}
            <div className="text-gray-300">
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
