// IU2U Bridge related types and interfaces
import { Chain } from 'viem';

export interface BridgeTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'sendToken' | 'callContract' | 'callContractWithToken';
  sourceChain: string;
  destinationChain?: string;
  amount: string;
  symbol: string;
  recipient?: string;
  contractAddress?: string;
  payload?: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  timestamp: number;
  gasUsed?: string;
  gasPrice?: string;
}

export interface IU2UContractAddresses {
  IU2U_TOKEN: string;
  IU2U_GATEWAY: string;
}

export interface BridgeState {
  selectedSourceChain: Chain | null;
  selectedDestinationChain: Chain | null;
  amount: string;
  recipientAddress: string;
  contractAddress: string;
  payload: string;
  isDepositMode: boolean;
  isContractCall: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface BridgeConfig {
  supportedChains: Chain[];
  contractAddresses: Record<string, IU2UContractAddresses>;
  defaultSourceChain: string;
  defaultDestinationChain: string;
}

// Bridge component props
export interface BridgePageProps {
  initialSourceChain?: string;
  initialDestinationChain?: string;
}

export interface ChainSelectorProps {
  chains: readonly Chain[];
  selectedChain: Chain | null;
  onChainSelect: (chain: Chain) => void;
  label: string;
  disabled?: boolean;
}

export interface TokenAmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  balance: string;
  symbol: string;
  maxAmount?: string;
  disabled?: boolean;
}

export interface AddressInputProps {
  address: string;
  onAddressChange: (address: string) => void;
  label: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

export interface BridgeActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export interface BridgeTransactionHistoryProps {
  transactions: BridgeTransaction[];
  onTransactionClick?: (transaction: BridgeTransaction) => void;
}

// Hook return types
export interface UseIU2UContractReturn {
  iu2uToken: any | null;
  iu2uGateway: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseIU2UBalanceReturn {
  balance: string;
  formattedBalance: string;
  isLoading: boolean;
  refetch: () => void;
}

export interface UseBridgeTransactionReturn {
  executeTransaction: () => Promise<string>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}