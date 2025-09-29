import { Spinner } from "@heroui/react";

import BridgeActionButton from "./BridgeActionButton";

import { useWeb3 } from "@/hooks/useWeb3";
import { ACTIVE_CHAINID, u2u } from "@/config/web3";
import { useBridgeChainSwitching } from "@/hooks/useBridgeChainSwitching";

interface DepositWithdrawButtonProps {
  amount: string;
  isLoading: boolean;
  isDepositMode: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  isConnected: boolean;
  onConnectWallet?: () => void;
}

export default function DepositWithdrawButton({
  amount,
  isLoading,
  isDepositMode,
  onDeposit,
  onWithdraw,
  isConnected,
  onConnectWallet,
}: DepositWithdrawButtonProps) {
  const { chain } = useWeb3();
  const isRightChain = chain?.id === ACTIVE_CHAINID;
  const { isSwitchingChain, switchToChain } = useBridgeChainSwitching();

  return isConnected ? (
    isRightChain ? (
      <BridgeActionButton
        disabled={!amount || parseFloat(amount) <= 0 || isLoading}
        loading={isLoading}
        onClick={isDepositMode ? onDeposit : onWithdraw}
      >
        {isDepositMode ? "Deposit U2U → IU2U" : "Withdraw IU2U → U2U"}
      </BridgeActionButton>
    ) : isSwitchingChain ? (
      <BridgeActionButton
        disabled={false}
        loading={false}
        onClick={() => switchToChain(u2u)}
      >
        <div className="flex items-center gap-2">
          <Spinner color="white" size="sm" />
          <span>Switching to U2U Solaris Mainnet...</span>
        </div>
      </BridgeActionButton>
    ) : (
      <BridgeActionButton
        disabled={false}
        loading={isLoading}
        onClick={() => switchToChain(u2u)}
      >
        Switch to U2U Solaris Mainnet to{" "}
        {isDepositMode ? "Deposit" : "Withdraw"}
      </BridgeActionButton>
    )
  ) : (
    <BridgeActionButton
      disabled={false}
      loading={false}
      onClick={onConnectWallet || (() => {})}
    >
      Connect Wallet to Perform Operation
    </BridgeActionButton>
  );
}
