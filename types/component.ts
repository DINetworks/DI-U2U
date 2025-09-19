// General component props and interfaces

import { Address } from "viem";

export interface DepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (
    tokenAddress: Address,
    amount: bigint,
    selectedToken?: Token,
  ) => Promise<void>;
  onApproveForVault?: (tokenAddress: Address, amount: bigint) => Promise<void>;
  isLoading: boolean;
  tokensInChain: Token[];
  whitelistedTokens: Address[];
}

export interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (creditAmount: bigint) => Promise<void>;
  isLoading: boolean;
  credit: string;
}

export interface GasCreditCardProps {
  credit: string;
}

export interface TransactionResult {
  type: "deposit" | "withdraw";
  token?: Token;
  amount: string;
  creditBefore: string;
  creditAfter: string;
  creditAdded: string;
  txHash?: string;
}

export interface TransactionCompleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: TransactionResult | null;
}

export interface DisapproveTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  onDisapprove: () => void;
}

export interface ApprovedTokensCardProps {
  approvedTokens: Token[];
  onApproveToken: () => void;
  onDisapproveToken: (token: Token) => void;
}

export interface ApproveTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (token: Token) => void;
  availableTokens: Token[];
}

export interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "transfers" | "credits";
}

export interface AddressProps {
  address: string;
  shorten?: boolean;
  showCopy?: boolean;
}

// Import Token type for component interfaces that use it
import { Token } from "./token";
