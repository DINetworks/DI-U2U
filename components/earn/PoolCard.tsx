import { motion } from 'framer-motion';
import { Card, CardBody } from '@heroui/card';
import { useRouter } from 'next/router';

interface Pool {
  chainId: number;
  address: string;
  exchange: string;
  feeTier: number;
  apr: number;
  tokens: {
    address: string;
    symbol: string;
    logoURI: string;
  }[];
}

interface PoolCardProps {
  pool: Pool;
  category: string;
}

export default function PoolCard({ pool, category }: PoolCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/25 backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Token Icons */}
              <div className="flex items-center">
                {pool.tokens.slice(0, 2).map((token, index) => (
                  <div
                    key={token.address}
                    className="w-8 h-8 rounded-full bg-gray border-2 border-gray/80 -ml-2 first:ml-0"
                    style={{ zIndex: pool.tokens.length - index }}
                  >
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-full h-full rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/images/token-placeholder.png';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Token Pair */}
              <div>
                <div className="text-white font-medium">
                  {pool.tokens[0]?.symbol}/{pool.tokens[1]?.symbol}
                </div>
                <div className="text-gray-400 text-sm">{pool.exchange}</div>
              </div>
            </div>

            {/* APR */}
            <div className="text-right">
              <div className="text-green-400 font-bold text-lg">
                {pool.apr.toFixed(2)}%
              </div>
              <div className="text-gray-400 text-xs">APR</div>
            </div>
          </div>

          {/* Fee Tier */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Fee Tier</span>
            <span className="text-white">{(pool.feeTier * 100).toFixed(2)}%</span>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}