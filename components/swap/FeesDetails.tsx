import { motion } from "framer-motion";
import { Button, CardBody } from "@heroui/react";

interface FeesDetailsProps {
  quote: any;
  setShowFeesDetails: (show: boolean) => void;
}

export default function FeesDetails({
  quote,
  setShowFeesDetails,
}: FeesDetailsProps) {

  return (
    <motion.div
      key="fees-details"
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      initial={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Fee Breakdown</h3>
          <Button
            color="warning"
            size="sm"
            variant="flat"
            onPress={() => setShowFeesDetails(false)}
          >
            Back
          </Button>
        </div>

        {/* Fee Breakdown */}
        {quote && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-black/60 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Gas Fee</span>
                  <span className="text-white font-medium">
                    {parseFloat(quote.bestRoute.totalGasCost).toFixed(6)} IU2U
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Network transaction fee
                </div>
              </div>

              <div className="p-4 bg-black/60 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Bridge Fee</span>
                  <span className="text-white font-medium">
                    {parseFloat(quote.bestRoute.bridgeFee).toFixed(6)} IU2U
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Cross-chain transfer fee
                </div>
              </div>

              <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-medium">Total Cost</span>
                  <span className="text-green-400 font-bold">
                    {(
                      parseFloat(quote.bestRoute.totalGasCost) +
                      parseFloat(quote.bestRoute.bridgeFee)
                    ).toFixed(6)}{" "}
                    IU2U
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </motion.div>
  );
}
