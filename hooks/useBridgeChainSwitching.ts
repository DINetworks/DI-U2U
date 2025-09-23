import { useState } from "react";
import { Chain } from "viem";
import { useSwitchChain } from "wagmi";

export interface UseBridgeChainSwitchingReturn {
  isSwitchingChain: boolean;
  switchToChain: (chain: Chain) => Promise<void>;
}

export function useBridgeChainSwitching(): UseBridgeChainSwitchingReturn {
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const switchToChain = async (chain: Chain) => {
    try {
      await switchChain({ chainId: chain.id });
    } catch (error) {
      console.error("Failed to switch chain:", error);
      throw error;
    }
  };

  return {
    isSwitchingChain,
    switchToChain,
  };
}