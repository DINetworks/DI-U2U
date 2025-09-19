import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export const useCredit = (vaultContract?: any) => {
  const { address } = useAccount();

  const {
    data: credit,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["credit", address],
    queryFn: async () => {
      if (!vaultContract || !address) {
        throw new Error("Vault contract or address not available");
      }

      const creditAmount = await vaultContract.getCredits();

      return creditAmount;
    },
    enabled: !!vaultContract && !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });

  const formattedCredit = credit
    ? (Number(credit) / 10 ** 18).toFixed(3)
    : "0.000";

  const refetchCredit = async () => {
    await refetch();
  };

  return {
    credit,
    formattedCredit,
    isLoading,
    error,
    refetchCredit,
  };
};
