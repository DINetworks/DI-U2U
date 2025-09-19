// Wallet related types and interfaces

export interface WalletContextType {
  openConnectModal: (() => void) | null;
  disconnect: (() => void) | undefined;
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
}
