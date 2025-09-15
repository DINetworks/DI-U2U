import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Address, parseEther } from "viem";

import { CONTRACT_ADDRESSES } from "@/config/web3";
import { AUCTION_ABI } from "@/contracts/abi";

const AUCTION_CONTRACT_ADDRESS =
  CONTRACT_ADDRESSES.HYBRID_DUTCH_AUCTION as Address;

export function useAuction() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createAuction = async (params: {
    tokenIds: bigint[];
    startPrice: string;
    reservePrice: string;
    priceDecrement: string;
    duration: number;
    rewardBudgetBps: number;
    royaltyIncrement: number;
  }) => {
    return await writeContractAsync({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: "createBatchAuction",
      args: [
        params.tokenIds,
        parseEther(params.startPrice),
        parseEther(params.reservePrice),
        parseEther((parseFloat(params.priceDecrement) / 30).toFixed(18)),
        BigInt(params.duration * 30),
        BigInt(params.rewardBudgetBps),
        BigInt(params.royaltyIncrement),
        "0x0000000000000000000000000000000000000000", // ETH
      ],
    });
  };

  const placeSoftBid = async (
    auctionId: number,
    threshold: string,
    desiredCount: number,
  ) => {
    const value = parseEther((parseFloat(threshold) * desiredCount).toString());

    return await writeContractAsync({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: "placeSoftBid",
      args: [BigInt(auctionId), parseEther(threshold), BigInt(desiredCount)],
      value,
    });
  };

  const placeHardBid = async (
    auctionId: number,
    desiredCount: number,
    currentPrice: string,
  ) => {
    const value = parseEther(
      (parseFloat(currentPrice) * desiredCount).toString(),
    );

    return await writeContractAsync({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_ABI,
      functionName: "placeHardBid",
      args: [BigInt(auctionId), BigInt(desiredCount)],
      value,
    });
  };

  return {
    createAuction,
    placeSoftBid,
    placeHardBid,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}
