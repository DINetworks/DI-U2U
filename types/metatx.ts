// Meta transaction related types and interfaces

import { Token } from "./token";

export type { Token };

export interface Transfer {
  id: number;
  token: string;
  receiver: string;
  amount: string;
}

export interface TransferRowProps {
  transfer: Transfer;
  approvedTokens: Token[];
  accountAddress: string;
  updateTransfer: (id: number, field: string, value: string) => void;
  removeTransfer: (id: number) => void;
  transfersLength: number;
}

export interface GaslessBatchTransferProps {
  credit: string;
  approvedTokens: Token[];
  onStartTransaction: () => void;
}

// History related types
export interface BatchTransferHistory {
  id: string;
  timestamp: number;
  txHash: string;
  creditConsumed: string;
  usdValueConsumed: string;
  transfers: Transfer[];
  status: "success" | "failed";
  blockNumber: string;
  gasCostNative: string;
}

export interface CreditTransactionHistory {
  id: string;
  timestamp: number;
  type: "deposit" | "withdraw";
  token?: Token;
  amount: string;
  creditBefore: string;
  creditAfter: string;
  creditChanged: string;
  txHash?: string;
}

export interface TransferPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transfers: Transfer[];
  approvedTokens: Token[];
  onSubmit: (response: any) => void;
}
