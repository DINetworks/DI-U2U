import { useReadContract, useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { useQuery } from "@tanstack/react-query";

import { CONTRACT_ADDRESSES } from "@/config/web3";
import { AUCTION_ABI } from "@/contracts/abi";
import { Auction, DomainInfo } from "@/types/auction";
import { timeLeft } from "@/utils/token";

const AUCTION_CONTRACT_ADDRESS =
  CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`;

export function useAuctionCounter() {
  const { data: auctionCounter } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "auctionCounter",
  });

  return {
    auctionCounter: auctionCounter ? Number(auctionCounter) : 0,
  };
}

export function useAuctionData(auctionId?: number) {
  const { data: auctionResult } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "auctions",
    args: auctionId !== undefined ? [BigInt(auctionId)] : undefined,
    query: { enabled: !!auctionId },
  });

  const { data: tokenIds } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "getAuctionTokenIds",
    args: auctionId !== undefined ? [BigInt(auctionId)] : undefined,
    query: { enabled: !!auctionId },
  });

  const { data: currentPrice } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "getCurrentPrice",
    args: auctionId !== undefined ? [BigInt(auctionId)] : undefined,
    query: { enabled: !!auctionId, refetchInterval: 5000 },
  });

  const { data: currentRoyalty } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "getCurrentRoyalty",
    args: auctionId !== undefined ? [BigInt(auctionId)] : undefined,
    query: { enabled: !!auctionId, refetchInterval: 5000 },
  });

  const { data: filledCount } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_ABI,
    functionName: "getAuctionFilled",
    args: auctionId !== undefined ? [BigInt(auctionId)] : undefined,
    query: { enabled: !!auctionId, refetchInterval: 5000 },
  });

  const auctionData = auctionResult as unknown as any[];

  const auction: Auction | null = auctionData
    ? {
        id: auctionId!,
        seller: auctionData[0] as string,
        tokenIds: Array.isArray(tokenIds)
          ? tokenIds.map((tid) => tid.toString())
          : [],
        startPrice: formatEther(auctionData[1] as bigint),
        reservePrice: formatEther(auctionData[2] as bigint),
        priceDecrement: formatEther(auctionData[3] as bigint),
        startBlock: Number(auctionData[4]),
        duration: Number(auctionData[5]),
        startedAt: new Date(Number(auctionData[6]) * 1000),
        endedAt: new Date(Number(auctionData[7]) * 1000),
        active: auctionData[8] as boolean,
        cleared: auctionData[9] as boolean,
        rewardBudgetBps: Number(auctionData[10]),
        royaltyIncrement: Number(auctionData[11]),
        paymentToken: auctionData[12] as string,
        totalConverted: Number(auctionData[13]),
        currentPrice: currentPrice ? formatEther(currentPrice as bigint) : "0",
        currentRoyalty: currentRoyalty ? Number(currentRoyalty) / 100 : 0,
        timeLeft: auctionData ? timeLeft(Number(auctionData[7])) : "",
        filled: filledCount ? Number(filledCount) : 0,
      }
    : null;

  return {
    auction,
  };
}

export function useAuctionsData(auctionCount: number) {
  const top15Ids = Array.from(
    { length: Math.min(15, auctionCount) },
    (_, i) => auctionCount - i,
  );

  const { data: auctionsData } = useReadContracts({
    contracts: top15Ids.map((id) => ({
      address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "auctions",
      args: [BigInt(id - 1)],
    })),
    query: {
      enabled: auctionCount > 0,
      refetchInterval: 20000, // 20 seconds
    },
  });

  const { data: auctionsTokensData } = useReadContracts({
    contracts: top15Ids.map((id) => ({
      address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "getAuctionTokenIds",
      args: [BigInt(id - 1)],
    })),
    query: {
      enabled: auctionCount > 0,
      refetchInterval: 20000, // 20 seconds
    },
  });

  const { data: auctionsPriceData } = useReadContracts({
    contracts: top15Ids.map((id) => ({
      address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "getCurrentPrice",
      args: [BigInt(id - 1)],
    })),
    query: {
      enabled: auctionCount > 0,
      refetchInterval: 20000, // 20 seconds
    },
  });

  const { data: auctionsRoyaltyData } = useReadContracts({
    contracts: top15Ids.map((id) => ({
      address: CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "getCurrentRoyalty",
      args: [BigInt(id - 1)],
    })),
    query: {
      enabled: auctionCount > 0,
      refetchInterval: 20000, // 20 seconds
    },
  });

  const { data: filledData } = useReadContracts({
    contracts: top15Ids.map((id) => ({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: "getAuctionFilled",
      args: [BigInt(id - 1)],
    })),
    query: {
      enabled: auctionCount > 0,
      refetchInterval: 20000, // 20 seconds
    },
  });

  const auctions = top15Ids
    .map((id, index) => {
      const auctionResult = auctionsData?.[index];
      const tokensResult = auctionsTokensData?.[index];
      const priceResult = auctionsPriceData?.[index];
      const royaltyResult = auctionsRoyaltyData?.[index];
      const fillResult = filledData?.[index];

      if (auctionResult?.status !== "success" || !auctionResult.result)
        return null;

      const data = auctionResult.result as unknown as any[];
      const tokenIds =
        tokensResult?.status === "success"
          ? (tokensResult.result as unknown as bigint[])
          : [];
      const currentPrice =
        priceResult?.status === "success"
          ? formatEther(priceResult.result as bigint)
          : "0";
      const currentRoyalty =
        royaltyResult?.status === "success"
          ? Number(royaltyResult.result) / 100
          : 0;
      const filled =
        fillResult?.status === "success"
          ? Number(fillResult.result as unknown as bigint)
          : 0;

      return {
        id,
        seller: data[0] as string,
        tokenIds: Array.isArray(tokenIds)
          ? tokenIds.map((tid) => tid.toString())
          : [],
        startPrice: formatEther(data[1] as bigint),
        reservePrice: formatEther(data[2] as bigint),
        priceDecrement: formatEther(data[3] as bigint),
        startBlock: Number(data[4]),
        duration: Number(data[5]),
        startedAt: new Date(Number(data[6]) * 1000),
        endedAt: new Date(Number(data[7]) * 1000),
        timeLeft: timeLeft(Number(data[7])),
        active: data[8] as boolean,
        cleared: data[9] as boolean,
        rewardBudgetBps: Number(data[10]),
        royaltyIncrement: Number(data[11]),
        paymentToken: data[12] as string,
        totalConverted: Number(data[13]),
        currentPrice: parseFloat(currentPrice).toFixed(5),
        currentRoyalty,
        filled,
      };
    })
    .filter((auction): auction is Auction => auction !== null) as Auction[];

  return {
    auctions,
  };
}

export function useDomainMetadata(tokenIds: string[] | undefined) {
  const domainQueries = useQuery({
    queryKey: ["domainInfo", tokenIds?.join(",")],
    queryFn: async () => {
      try {
        const mainUrl = `/api/domain-info`;
        const response = await fetch(mainUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenIds: tokenIds || [],
          }),
        });

        if (response.ok) {
          const { domainInfos } = await response.json();

          return domainInfos as DomainInfo[];
        }
      } catch (error) {
        console.error("Error fetching domain metadata:", error);
      }

      return [];
    },
    enabled: !!tokenIds && tokenIds.length > 0,
  });

  return {
    domainInfos: domainQueries?.data,
  };
}
