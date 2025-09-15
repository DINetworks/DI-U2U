export interface Auction {
  id: number;
  seller: string;
  tokenIds: string[];
  startPrice: string;
  reservePrice: string;
  priceDecrement: string;
  startBlock: number;
  duration: number;
  startedAt: Date;
  endedAt: Date;
  active: boolean;
  cleared: boolean;
  rewardBudgetBps: number;
  royaltyIncrement: number;
  paymentToken: string;
  totalConverted: number;
  currentPrice: string;
  currentRoyalty: number;
  timeLeft: string;
  filled: number;
}

export interface PremiumAuction {
  id: number;
  seller: string;
  tokenId: bigint;
  startPrice: bigint;
  reservePrice: bigint;
  priceDecrement: bigint;
  startedAt: number;
  endedAt: number;
  highPrice: bigint;
  lowPrice: bigint;
  active: boolean;
  cleared: boolean;
  winner: string;
  finalPrice: bigint;
}

export interface DomainInfo {
  id: string;
  name: string;
  image?: string;
}
