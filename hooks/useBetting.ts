import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { BETTING_ABI } from "@/contracts/abi";
import { CONTRACT_ADDRESSES } from "@/config/web3";

const AUCTION_BETTING_ADDRESS =
  CONTRACT_ADDRESSES.AUCTION_BETTING as `0x${string}`;

export function useBetting() {
  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createAuctionBetting = async (
    tokenId: bigint,
    startPrice: bigint,
    reservePrice: bigint,
    priceDecrement: bigint,
    duration: number,
    highPrice: bigint,
    lowPrice: bigint,
    commitDuration: number,
    revealDuration: number,
  ) => {
    return writeContractAsync({
      address: AUCTION_BETTING_ADDRESS,
      abi: BETTING_ABI,
      functionName: "createAuctionBetting",
      args: [
        BigInt(tokenId),
        startPrice,
        reservePrice,
        priceDecrement,
        BigInt(duration),
        highPrice,
        lowPrice,
        BigInt(commitDuration),
        BigInt(revealDuration),
      ],
    });
  };

  const placeBid = async (auctionId: number, value: bigint) => {
    return writeContractAsync({
      address: AUCTION_BETTING_ADDRESS,
      abi: BETTING_ABI,
      functionName: "placeBid",
      args: [BigInt(auctionId)],
      value,
    });
  };

  const commitBet = async (
    auctionId: number,
    commitHash: `0x${string}`,
    amount: bigint,
  ) => {
    return writeContractAsync({
      address: AUCTION_BETTING_ADDRESS,
      abi: BETTING_ABI,
      functionName: "commitBet",
      args: [BigInt(auctionId), commitHash, amount],
    });
  };

  const revealBet = async (
    auctionId: number,
    choice: number,
    amount: bigint,
    secret: bigint,
  ) => {
    return writeContractAsync({
      address: AUCTION_BETTING_ADDRESS,
      abi: BETTING_ABI,
      functionName: "revealBet",
      args: [BigInt(auctionId), choice, amount, secret],
    });
  };

  const settleBetting = async (auctionId: number) => {
    return writeContractAsync({
      address: AUCTION_BETTING_ADDRESS,
      abi: BETTING_ABI,
      functionName: "settleBetting",
      args: [BigInt(auctionId)],
    });
  };

  return {
    createAuctionBetting,
    placeBid,
    commitBet,
    revealBet,
    settleBetting,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}
