import { Card, CardBody } from '@heroui/card';
import { GasFeeDisplayProps } from '@/types/swap';

export default function GasFeeDisplay({
  gasCost,
  bridgeFee,
  totalCost,
  currency
}: GasFeeDisplayProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <CardBody className="p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Estimated Fees</h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Gas Cost</span>
            <span className="text-sm font-medium text-white">
              {parseFloat(gasCost).toFixed(6)} {currency}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Bridge Fee</span>
            <span className="text-sm font-medium text-white">
              {parseFloat(bridgeFee).toFixed(6)} {currency}
            </span>
          </div>

          <div className="border-t border-white/10 pt-2 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">Total Cost</span>
              <span className="text-sm font-bold text-green-400">
                {parseFloat(totalCost).toFixed(6)} {currency}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 p-2 bg-yellow-900/20 rounded-lg">
          <p className="text-xs text-yellow-300">
            💡 Fees are estimates and may vary based on network conditions
          </p>
        </div>
      </CardBody>
    </Card>
  );
}