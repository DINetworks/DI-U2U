import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useGaslessContracts } from './useGaslessContracts'

export const useCredit = () => {
  const { address } = useAccount()
  const { vaultContract } = useGaslessContracts()
  const queryClient = useQueryClient()

  const {
    data: credit,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['credit', address],
    queryFn: async () => {
      if (!vaultContract || !address) {
        throw new Error('Vault contract or address not available')
      }

      const creditAmount = await vaultContract.getCredits()
      return creditAmount
    },
    enabled: !!vaultContract && !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })

  // Format credit for display (18 decimals)
  const formattedCredit = credit ? (Number(credit) / 10**18).toFixed(3) : '0.000'

  const refetchCredit = () => {
    queryClient.invalidateQueries({ queryKey: ['credit', address] })
  }

  return {
    credit,
    formattedCredit,
    isLoading,
    error,
    refetch: refetchCredit
  }
}