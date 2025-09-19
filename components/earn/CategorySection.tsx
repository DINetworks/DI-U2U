import { Button } from "@heroui/button";
import { useRouter } from "next/router";

import PoolCard from "./PoolCard";

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

interface CategorySectionProps {
  title: string;
  pools: Pool[];
  category: string;
}

export default function CategorySection({
  title,
  pools,
  category,
}: CategorySectionProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <Button
          color="primary"
          size="sm"
          variant="flat"
          onPress={() => router.push(`/earn/pools?category=${category}`)}
        >
          View All
        </Button>
      </div>

      {pools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pools.slice(0, 9).map((pool, index) => (
            <PoolCard
              key={`${pool.address}-${index}`}
              category={category}
              pool={pool}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No pools available in this category</p>
        </div>
      )}
    </div>
  );
}
