import { useQuery } from "@tanstack/react-query";
import { Address, erc20Abi } from "viem";
import { usePublicClient } from "wagmi";

interface UseTokenAllowanceProps {
  tokenAddress: Address;
  ownerAddress: Address;
  spenderAddress: Address;
}

export function useTokenAllowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
}: UseTokenAllowanceProps) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["tokenAllowance", tokenAddress, ownerAddress, spenderAddress],
    queryFn: async () => {
      if (!publicClient) throw new Error("No public client available");

      const allowance = (await publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [ownerAddress, spenderAddress],
      })) as bigint;

      return allowance;
    },
    enabled:
      !!publicClient && !!tokenAddress && !!ownerAddress && !!spenderAddress,
    staleTime: 30000, // 30 seconds
  });
}
