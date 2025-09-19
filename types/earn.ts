// Shared types for Earn components

export interface Pool {
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

export interface EarnPoolsResponse {
  code: number;
  message: string;
  data: {
    highlightedPools: Pool[];
    highAPR: Pool[];
    solidEarning: Pool[];
    lowVolatility: Pool[];
    farmingPools?: Pool[];
  };
  requestId: string;
}

export interface PoolsResponse {
  code: number;
  message: string;
  data: {
    pools: Pool[];
    total: number;
    page: number;
    limit: number;
    pagination: {
      totalItems: number;
    };
  };
}

export interface FilterOption {
  key: string;
  label: string;
}