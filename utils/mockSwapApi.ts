// Mock API for cross-chain swap functionality
// This simulates DEX aggregator behavior with 30+ DEXes

import { RouteRequest, RouteResponse, ExecuteRequest, ExecuteResponse, CrossChainRoute, DexRoute, SwapQuote } from '@/types/swap';

// Mock DEX list (simulating 30+ DEXes)
const MOCK_DEXES = [
  'Uniswap V3', 'Uniswap V2', 'SushiSwap', 'PancakeSwap', '1inch',
  'Curve', 'Balancer', 'Compound', 'Aave', 'Yearn',
  'Convex', 'Lido', 'Rocket Pool', 'Frax', 'OlympusDAO',
  'Alchemix', 'Abracadabra', 'Spell', 'Tokemak', 'Indexed',
  'Pickle', 'Harvest', 'ACryptoS', 'Beefy', 'Autofarm',
  'Pangolin', 'Trader Joe', 'SpookySwap', 'SpiritSwap', 'QuickSwap',
  'ApeSwap', 'Mdex', 'Biswap', 'BabySwap', 'Nomiswap'
];

// Mock IU2U token addresses on different chains
const IU2U_ADDRESSES: Record<string, string> = {
  '1': '0x9649a304bD0cd3c4dbe72116199990df06d87329', // Ethereum
  '56': '0x365235b4ea2F5439f27b10f746C52B0B47c33761', // BSC
  '137': '0x9649a304bD0cd3c4dbe72116199990df06d87329', // Polygon
  '42161': '0x9649a304bD0cd3c4dbe72116199990df06d87329', // Arbitrum
  '10': '0x9649a304bD0cd3c4dbe72116199990df06d87329', // Optimism
  '8453': '0xF69C5FB9359a4641469cd457412C7086fd32041D', // Base
  '43114': '0x9649a304bD0cd3c4dbe72116199990df06d87329', // Avalanche
  '2484': '0x2551f9E86a20bf4627332A053BEE14DA623d1007' // U2U Testnet
};

// Generate mock DEX route
function generateMockDexRoute(
  fromToken: string,
  toToken: string,
  amountIn: string,
  dexName: string
): DexRoute {
  const amountInNum = parseFloat(amountIn);
  const priceImpact = (Math.random() * 0.05).toFixed(4); // 0-5% price impact
  const fee = (amountInNum * 0.003).toFixed(6); // 0.3% fee
  const estimatedGas = Math.floor(Math.random() * 200000 + 100000).toString();

  // Calculate amount out with some randomness
  const slippage = 1 - (Math.random() * 0.02); // 0-2% slippage
  const amountOutNum = amountInNum * (1 - parseFloat(priceImpact)) * slippage;
  const amountOut = amountOutNum.toFixed(6);
  const minimumReceived = (amountOutNum * 0.98).toFixed(6); // 2% slippage tolerance

  return {
    dexName,
    path: [fromToken, toToken],
    amountIn,
    amountOut,
    estimatedGas,
    fee,
    impact: `${(parseFloat(priceImpact) * 100).toFixed(2)}%`,
    minimumReceived
  };
}

// Generate mock cross-chain route
function generateMockCrossChainRoute(
  request: RouteRequest,
  sourceChain: any,
  destinationChain: any,
  sourceToken: any,
  destinationToken: any
): CrossChainRoute {
  // Generate multiple DEX routes for source chain (source token -> IU2U)
  const sourceDexRoutes = MOCK_DEXES.slice(0, 15).map(dex =>
    generateMockDexRoute(sourceToken.address, IU2U_ADDRESSES[sourceChain.id], request.amount, dex)
  );

  // Generate multiple DEX routes for destination chain (IU2U -> destination token)
  const destinationDexRoutes = MOCK_DEXES.slice(15, 30).map(dex =>
    generateMockDexRoute(IU2U_ADDRESSES[destinationChain.id], destinationToken.address, '1000000000000000000', dex) // 1 IU2U
  );

  // Find best routes
  const bestSourceRoute = sourceDexRoutes.reduce((best, current) =>
    parseFloat(current.amountOut) > parseFloat(best.amountOut) ? current : best
  );

  const bestDestinationRoute = destinationDexRoutes.reduce((best, current) =>
    parseFloat(current.amountOut) > parseFloat(best.amountOut) ? current : best
  );

  // Calculate totals
  const bridgeFee = (parseFloat(request.amount) * 0.001).toFixed(6); // 0.1% bridge fee
  const totalGasCost = (parseFloat(bestSourceRoute.estimatedGas) + parseFloat(bestDestinationRoute.estimatedGas) + 150000).toString();
  const estimatedTime = Math.floor(Math.random() * 300 + 120); // 2-7 minutes

  // Calculate final amount out
  const iu2uAmount = parseFloat(bestSourceRoute.amountOut);
  const finalAmountOut = parseFloat(bestDestinationRoute.amountOut);
  const minimumReceived = (finalAmountOut * 0.95).toFixed(6); // 5% total slippage tolerance

  // Calculate price impact
  const inputUSD = parseFloat(request.amount) * (sourceToken.usdPrice || 1);
  const outputUSD = finalAmountOut * (destinationToken.usdPrice || 1);
  const priceImpact = ((inputUSD - outputUSD) / inputUSD * 100).toFixed(2);

  return {
    sourceChain,
    destinationChain,
    sourceToken,
    destinationToken,
    sourceDexRoute: bestSourceRoute,
    destinationDexRoute: bestDestinationRoute,
    bridgeFee,
    estimatedTime,
    totalGasCost,
    minimumReceived,
    priceImpact: `${priceImpact}%`,
    routeId: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
}

// Mock API function for getting swap routes
export async function getSwapRoutes(request: RouteRequest): Promise<RouteResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Mock chains and tokens (in real app, these would come from useTokenAndChains hook)
    const mockChains = [
      { id: '1', name: 'Ethereum', chainType: 'evm' },
      { id: '56', name: 'BSC', chainType: 'evm' },
      { id: '137', name: 'Polygon', chainType: 'evm' },
      { id: '42161', name: 'Arbitrum', chainType: 'evm' },
      { id: '2484', name: 'U2U Nebulas Testnet', chainType: 'evm' }
    ];

    const mockTokens = [
      { address: '0xA0b86a33E6441e88C5F2712C3E9b74F5c4d6E3E', symbol: 'ETH', usdPrice: 2500, chainId: '1' },
      { address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', symbol: 'USDC', usdPrice: 1, chainId: '56' },
      { address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', symbol: 'MATIC', usdPrice: 0.8, chainId: '137' },
      { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB', usdPrice: 1.2, chainId: '42161' },
      { address: '0x2551f9E86a20bf4627332A053BEE14DA623d1007', symbol: 'IU2U', usdPrice: 0.1, chainId: '2484' }
    ];

    const sourceChain = mockChains.find(c => c.id === request.sourceChainId);
    const destinationChain = mockChains.find(c => c.id === request.destinationChainId);
    const sourceToken = mockTokens.find(t => t.address === request.sourceTokenAddress);
    const destinationToken = mockTokens.find(t => t.address === request.destinationTokenAddress);

    if (!sourceChain || !destinationChain || !sourceToken || !destinationToken) {
      return {
        success: false,
        error: 'Invalid chain or token parameters'
      };
    }

    // Generate multiple routes with different DEX combinations
    const routes: CrossChainRoute[] = [];
    for (let i = 0; i < 5; i++) {
      routes.push(generateMockCrossChainRoute(request, sourceChain, destinationChain, sourceToken, destinationToken));
    }

    // Sort by best output amount
    routes.sort((a, b) => parseFloat(b.destinationDexRoute.amountOut) - parseFloat(a.destinationDexRoute.amountOut));

    const bestRoute = routes[0];
    const exchangeRate = (parseFloat(bestRoute.destinationDexRoute.amountOut) / parseFloat(request.amount)).toFixed(6);

    const quote: SwapQuote = {
      routes,
      bestRoute,
      sourceAmount: request.amount,
      destinationAmount: bestRoute.destinationDexRoute.amountOut,
      exchangeRate,
      timestamp: Date.now()
    };

    return {
      success: true,
      data: quote
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Mock API function for executing swap
export async function executeSwap(request: ExecuteRequest): Promise<ExecuteResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (!isSuccess) {
      return {
        success: false,
        error: 'Transaction failed due to network congestion'
      };
    }

    // Generate mock transaction hashes
    const transactionId = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sourceTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    return {
      success: true,
      data: {
        transactionId,
        sourceTxHash
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Execution failed'
    };
  }
}

// Helper function to get IU2U token address for a chain
export function getIU2UTokenAddress(chainId: string): string {
  return IU2U_ADDRESSES[chainId] || IU2U_ADDRESSES['1']; // fallback to Ethereum
}

// Helper function to check if route is still valid (within 5 minutes)
export function isRouteValid(quote: SwapQuote): boolean {
  const now = Date.now();
  const routeAge = now - quote.timestamp;
  return routeAge < 5 * 60 * 1000; // 5 minutes
}