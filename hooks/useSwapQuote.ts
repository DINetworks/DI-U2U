import { useQuery } from '@tanstack/react-query';
import { SwapChain, SwapToken, SwapQuote } from '@/types/swap';
import { getSwapRoutes } from '@/utils/mockSwapApi';

interface UseSwapQuoteParams {
  sourceChain: SwapChain | null;
  destinationChain: SwapChain | null;
  sourceToken: SwapToken | null;
  destinationToken: SwapToken | null;
  amount: string;
  slippage: number;
  enabled?: boolean;
}

interface SwapQuoteResult {
  quote: SwapQuote | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSwapQuote({
  sourceChain,
  destinationChain,
  sourceToken,
  destinationToken,
  amount,
  slippage,
  enabled = true
}: UseSwapQuoteParams): SwapQuoteResult {
  const {
    data: quote,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [
      'swapQuote',
      sourceChain?.id,
      destinationChain?.id,
      sourceToken?.address,
      destinationToken?.address,
      amount,
      slippage
    ],
    queryFn: async (): Promise<SwapQuote | null> => {
      // Validate required parameters
      if (!sourceChain || !destinationChain || !sourceToken || !destinationToken || !amount) {
        return null;
      }

      // Validate amount is a positive number
      const amountValue = parseFloat(amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        return null;
      }

      const request = {
        sourceChainId: sourceChain.id,
        destinationChainId: destinationChain.id,
        sourceTokenAddress: sourceToken.address,
        destinationTokenAddress: destinationToken.address,
        amount,
        slippage
      };

      const response = await getSwapRoutes(request);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get swap quote');
      }
    },
    enabled: enabled && !!sourceChain && !!destinationChain && !!sourceToken && !!destinationToken && !!amount,
    refetchInterval: 15000, // Refetch every 15 seconds
    refetchIntervalInBackground: false, // Don't refetch when window is not focused
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors, but not for validation errors
      if (failureCount >= 3) return false;
      return !(error instanceof Error && error.message.includes('validation'));
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    quote: quote || null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch
  };
}