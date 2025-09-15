import { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
  openConnectModal: (() => void) | null;
  setOpenConnectModal: (opener: (() => void) | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [openConnectModal, setOpenConnectModal] = useState<(() => void) | null>(
    null,
  );

  return (
    <WalletContext.Provider value={{ openConnectModal, setOpenConnectModal }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletModal() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWalletModal must be used within WalletProvider");
  }

  return context;
}
