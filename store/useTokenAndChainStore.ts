import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenAndChainState {
  tokens: any[];
  chains: any[];
  initializedAt: number;
  setTokenAndChain: (data: Partial<TokenAndChainState>) => void;
}

export const useTokenAndChainStore = create<TokenAndChainState>()(
  persist(
    (set) => ({
      tokens: [],
      chains: [],
      initializedAt: 0,
      setTokenAndChain: (data) => set(() => data),
    }),
    {
      name: "token-chain-store",
    },
  ),
);
