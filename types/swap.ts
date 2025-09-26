// Cross-chain swap related types and interfaces

export interface SwapToken {
  symbol: string;
  address: string;
  chainId: string;
  name: string;
  decimals: number;
  coingeckoId: string;
  type: string;
  logoURI: string;
  subGraphOnly: boolean;
  subGraphIds: string[];
  active: boolean;
  visible: boolean;
  usdPrice: number;
}

export interface SwapChain {
  id: string;
  chainId: string;
  networkIdentifier: string;
  chainName: string;
  axelarChainName: string;
  type: string;
  networkName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
  };
  chainIconURI: string;
  blockExplorerUrls: string[];
  swapAmountForGas: string;
  sameChainSwapsSupported: boolean;
  squidContracts: {
    squidRouter: string;
    defaultCrosschainToken: string;
    squidMulticall: string;
    squidFeeCollector: string;
    squidCoralMulticall: string;
  };
  compliance: {
    trmIdentifier: string;
  };
  boostSupported: boolean;
  enableBoostByDefault: boolean;
  bridges: {
    axelar?: {
      gateway: string;
      itsService: string;
      gasService: string;
    };
    cctp?: {
      cctpDomain: string;
      tokenMessenger: string;
      messageTransmitter: string;
    };
    chainflip?: {
      vault: string;
    };
  };
  rpcList: string[];
  visible: boolean;
  chainNativeContracts: {
    wrappedNativeToken: string;
    ensRegistry: string;
    multicall: string;
    usdcToken: string;
  };
  feeCurrencies: any[];
  currencies: any[];
  features: any[];
  enabled: boolean;
  supportedBridgeTypes: string[];
  coralMessageProvider: string;
  layerZeroEndpoint: string;
  horizonRpcList: string[];
  internalHorizonRpcList: string[];
  isTestnet: boolean;
  rpc: string;
  chainType: string;
}

export interface DexRoute {
  dexName: string;
  path: string[];
  amountIn: string;
  amountOut: string;
  estimatedGas: string;
  fee: string;
  impact: string;
  minimumReceived: string;
}

export interface CrossChainRoute {
  sourceChain: SwapChain;
  destinationChain: SwapChain;
  sourceToken: SwapToken;
  destinationToken: SwapToken;
  sourceDexRoute: DexRoute;
  destinationDexRoute: DexRoute;
  bridgeFee: string;
  estimatedTime: number; // in seconds
  totalGasCost: string;
  minimumReceived: string;
  priceImpact: string;
  routeId: string;
}

export interface SwapQuote {
  routes: CrossChainRoute[];
  bestRoute: CrossChainRoute;
  sourceAmount: string;
  destinationAmount: string;
  exchangeRate: string;
  timestamp: number;
}

export interface SwapTransaction {
  id: string;
  status:
    | "pending"
    | "executing_source_swap"
    | "bridging"
    | "executing_destination_swap"
    | "completed"
    | "failed";
  sourceChain: SwapChain;
  destinationChain: SwapChain;
  sourceToken: SwapToken;
  destinationToken: SwapToken;
  amountIn: string;
  amountOut: string;
  route: CrossChainRoute;
  txHashes: {
    sourceSwap?: string;
    bridge?: string;
    destinationSwap?: string;
  };
  timestamp: number;
  error?: string;
}

export interface SwapState {
  sourceChain: SwapChain | null;
  destinationChain: SwapChain | null;
  sourceToken: SwapToken | null;
  destinationToken: SwapToken | null;
  amount: string;
  isLoading: boolean;
  quote: SwapQuote | null;
  error: string | null;
  slippage: number;
}

export interface SwapChainSelectorProps {
  chain: SwapChain | null;
  onChainSelect: (chain: SwapChain) => void;
  chains: SwapChain[];
  label: string;
  disabled?: boolean;
}

export interface GasFeeDisplayProps {
  gasCost: string;
  bridgeFee: string;
  totalCost: string;
  currency: string;
}

export interface RouterStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CrossChainRoute;
}

export interface SwapButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  children: React.ReactNode;
  canGetQuote: boolean;
  quote?: SwapQuote | null;
}

// API Response types
export interface RouteRequest {
  sourceChainId: string;
  destinationChainId: string;
  sourceTokenAddress: string;
  destinationTokenAddress: string;
  amount: string;
  slippage: number;
}

export interface RouteResponse {
  success: boolean;
  data?: SwapQuote;
  error?: string;
}

export interface ExecuteRequest {
  routeId: string;
  slippage: number;
  recipientAddress: string;
}

export interface ExecuteResponse {
  success: boolean;
  data?: {
    transactionId: string;
    sourceTxHash?: string;
  };
  error?: string;
}

// Hook return types
export interface UseSwapQuoteReturn {
  quote: SwapQuote | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseSwapExecutionReturn {
  executeSwap: (request: ExecuteRequest) => Promise<ExecuteResponse>;
  isLoading: boolean;
  error: string | null;
}
