import { nativeEvmTokenAddress } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";
import { Address, erc20Abi, formatUnits } from "viem";
import { usePublicClient } from "wagmi";

interface UseTokenBalanceProps {
  chainId?: number;
  tokenAddress: Address;
  accountAddress: Address;
  decimals?: number;
}

export function useTokenBalance({
  chainId,
  tokenAddress,
  accountAddress,
  decimals = 18,
}: UseTokenBalanceProps) {
  const publicClient = usePublicClient({ chainId });

  return useQuery({
    queryKey: ["tokenBalance", tokenAddress, accountAddress],
    queryFn: async () => {
      if (!publicClient) return undefined;

      const balance =
        tokenAddress.toLowerCase() == nativeEvmTokenAddress
          ? await publicClient.getBalance({
              address: accountAddress,
            })
          : ((await publicClient.readContract({
              address: tokenAddress,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [accountAddress],
            })) as bigint);

      return {
        raw: balance,
        formatted: formatUnits(balance, decimals),
      };
    },
    enabled: !!publicClient && !!tokenAddress && !!accountAddress,
    staleTime: 15000, // 30 seconds
    refetchInterval: 30000, // Refetch every minute
  });
}
