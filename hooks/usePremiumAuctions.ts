import { useReadContract, useReadContracts } from "wagmi";

import { useDomainMetadata } from "./useAuctions";

import { BETTING_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES } from "@/config/web3";
import { PremiumAuction } from "@/types/auction";

const AUCTION_BETTING = CONTRACT_ADDRESSES.AUCTION_BETTING as `0x${string}`;

export function usePremiumAuctions() {
  const { data: auctionCounter } = useReadContract({
    address: AUCTION_BETTING,
    abi: BETTING_ABI,
    functionName: "auctionCounter",
  });

  const count = auctionCounter ? Number(auctionCounter) : 0;

  const { data: auctionsData, isLoading } = useReadContracts({
    contracts: Array.from({ length: count }, (_, i) => ({
      address: AUCTION_BETTING,
      abi: BETTING_ABI,
      functionName: "auctions",
      args: [BigInt(i)],
    })),
    query: { enabled: count > 0 },
  });

  const auctions: (PremiumAuction | null)[] =
    auctionsData
      ?.map((result, index) => {
        if (result.status === "success" && result.result) {
          const data = result.result as unknown as readonly [
            string,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
            boolean,
            string,
            bigint,
          ];
          const [
            seller,
            tokenId,
            startPrice,
            reservePrice,
            priceDecrement,
            startedAt,
            endedAt,
            highPrice,
            lowPrice,
            active,
            cleared,
            winner,
            finalPrice,
          ] = data;

          return {
            id: index + 1,
            seller,
            tokenId: tokenId,
            startPrice,
            reservePrice,
            priceDecrement,
            startedAt: Number(startedAt),
            endedAt: Number(endedAt),
            highPrice,
            lowPrice,
            active,
            cleared,
            winner,
            finalPrice,
          };
        }

        return null;
      })
      .filter(Boolean) || [];

  const { domainInfos } = useDomainMetadata(
    auctions?.map((auction) => auction?.tokenId.toString() || "[]"),
  );

  return {
    auctionCounter: count,
    auctions,
    domainInfos,
    isLoading,
  };
}

export function usePremiumAuction(id: string) {
  const { data: auctionData, isLoading } = useReadContract({
    address: AUCTION_BETTING,
    abi: BETTING_ABI,
    functionName: "auctions",
    args: id != undefined ? [BigInt(id)] : undefined,
    query: { enabled: id !== undefined },
  });

  const auction: PremiumAuction | null = auctionData
    ? {
        id: Number(id),
        seller: auctionData[0] as string,
        tokenId: auctionData[1] as bigint,
        startPrice: auctionData[2] as bigint,
        reservePrice: auctionData[3] as bigint,
        priceDecrement: auctionData[4] as bigint,
        startedAt: Number(auctionData[5] as bigint),
        endedAt: Number(auctionData[6] as bigint),
        highPrice: auctionData[7] as bigint,
        lowPrice: auctionData[8] as bigint,
        active: auctionData[9] as boolean,
        cleared: auctionData[10] as boolean,
        winner: auctionData[11] as string,
        finalPrice: auctionData[12] as bigint,
      }
    : null;

  const { domainInfos } = useDomainMetadata(
    auction?.tokenId ? [auction?.tokenId?.toString()] : [],
  );

  return {
    auction,
    domainInfo: domainInfos ? domainInfos[0] : null,
    isLoading,
  };
}
