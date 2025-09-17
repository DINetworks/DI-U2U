import { useQuery } from "@tanstack/react-query";
import { Address, erc20Abi, formatUnits } from "viem";
import { usePublicClient } from "wagmi";

interface UseTokenBalanceProps {
  tokenAddress: Address;
  accountAddress: Address;
  decimals?: number;
}

export function useTokenBalance({
  tokenAddress,
  accountAddress,
  decimals = 18
}: UseTokenBalanceProps) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["tokenBalance", tokenAddress, accountAddress],
    queryFn: async () => {
      if (!publicClient) throw new Error("No public client available");

      const balance = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [accountAddress],
      }) as bigint;

      return {
        raw: balance,
        formatted: formatUnits(balance, decimals),
      };
    },
    enabled: !!publicClient && !!tokenAddress && !!accountAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}