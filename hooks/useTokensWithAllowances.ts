import { useMemo } from 'react'
import { Address, erc20Abi, formatUnits } from 'viem'
import { useAccount, useChainId, useReadContracts } from 'wagmi'
import { useTokenAndChains } from './useTokenAndChains'

export const useTokensWithAllowances = (spender: Address) => {
  const { tokens } = useTokenAndChains()

  const chainId = useChainId()
  const { address: owner } = useAccount()

  const allowanceContracts = useMemo(() => {
    if (!owner || !spender || !tokens?.length) return []

    return tokens.map(token => ({
      address: token.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [owner, spender]
    }))
  }, [tokens, owner, spender])

  const {
    data: allowanceResults,
    refetch: refetchAllowances,
    isLoading,
    isError
  } = useReadContracts({
    contracts: allowanceContracts,
    batchSize: 8192,
    query: {
      enabled:
        !!owner && !!spender && !!chainId && allowanceContracts.length > 0
    }
  })

  const tokensWithAllowance = useMemo(() => {
    if (!allowanceResults || !tokens) return []

    return tokens.map((token, index) => {
      const result = allowanceResults[index]

      const allowanceValue =
        result?.status === 'success' && result.result
          ? formatUnits(result.result as bigint, token.decimals)
          : '0'

      return {
        token,
        allowance: allowanceValue
      }
    })
  }, [allowanceResults, tokens])

  const approvedTokens = useMemo(
    () =>
      tokensWithAllowance
        ?.filter(
          tokenAllowance =>
            !!tokenAllowance.allowance && tokenAllowance.allowance != '0'
        )
        .map(t => t.token),
    [tokensWithAllowance]
  )

  return {
    tokensInChain: tokens,
    tokensWithAllowance,
    approvedTokens,
    refetchAllowances,
    isLoading,
    isError
  }
}
