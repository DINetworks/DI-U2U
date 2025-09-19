import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table';
import { Button } from '@heroui/button';
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
  tvl?: number;
  volume24h?: number;
}

interface PoolTableProps {
  pools: Pool[];
  chains: { key: string; label: string }[];
  totalItems: number;
}

export default function PoolTable({ pools, chains, totalItems }: PoolTableProps) {
  const router = useRouter();

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className='mt-8'>
			<div className='mb-4'>
					{totalItems} pools found
			</div>
      <Table 
        aria-label="Pools table" 
        removeWrapper>
        <TableHeader>
          <TableColumn>Pool</TableColumn>
          <TableColumn>Protocol</TableColumn>
          <TableColumn>Fee Tier</TableColumn>
          <TableColumn>APR</TableColumn>
          <TableColumn>TVL</TableColumn>
          <TableColumn>Volume 24h</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <TableRow key={pool.address} className="hover:bg-white/10 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {pool.tokens.slice(0, 2).map((token, index) => (
                      <div
                        key={token.address}
                        className="w-6 h-6 rounded-full border-2 border-black/80 -ml-1 first:ml-0"
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
                  <div>
                    <div className="text-white font-medium">
                      {pool.tokens[0]?.symbol}/{pool.tokens[1]?.symbol}
                    </div>
                    <div className="text-gray-400 text-xs font-mono">
                      {pool.address.slice(0, 6)}...{pool.address.slice(-4)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-white">{pool.exchange}</span>
              </TableCell>
              <TableCell>
                <span className="text-white">{(pool.feeTier * 100).toFixed(2)}%</span>
              </TableCell>
              <TableCell>
                <span className="text-green-400 font-bold">{pool.apr.toFixed(2)}%</span>
              </TableCell>
              <TableCell>
                <span className="text-white">{pool.tvl ? `$${formatNumber(pool.tvl)}` : 'N/A'}</span>
              </TableCell>
              <TableCell>
                <span className="text-white">{pool.volume24h ? `$${formatNumber(pool.volume24h)}` : 'N/A'}</span>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => router.push(`/earn/pool/${pool.address}`)}
                >
                  Add Liquidity
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}