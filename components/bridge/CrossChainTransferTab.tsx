import { Chain } from "viem";

import ChainSelector from "./ChainSelector";
import AddressInput from "./AddressInput";
import TokenAmountInput from "./TokenAmountInput";
import BridgeActionButton from "./BridgeActionButton";

import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";

interface CrossChainTransferTabProps {
  selectedSourceChain: Chain | null;
  onSourceChainSelect: (chain: Chain) => void;
  selectedDestinationChain: Chain | null;
  onDestinationChainSelect: (chain: Chain) => void;
  recipientAddress: string;
  onRecipientAddressChange: (address: string) => void;
  bridgeAmount: string;
  onBridgeAmountChange: (amount: string) => void;
  iu2uBalance: string;
  onSendToken: () => void;
  isLoading: boolean;
  isConnected: boolean;
  isSourceChainCurrent: boolean;
  isSwitchingChain: boolean;
  onSwitchToSourceChain: () => void;
  onConnectWallet?: () => void;
}

export default function CrossChainTransferTab({
  selectedSourceChain,
  onSourceChainSelect,
  selectedDestinationChain,
  onDestinationChainSelect,
  recipientAddress,
  onRecipientAddressChange,
  bridgeAmount,
  onBridgeAmountChange,
  iu2uBalance,
  onSendToken,
  isLoading,
  isConnected,
  isSourceChainCurrent,
  isSwitchingChain,
  onSwitchToSourceChain,
  onConnectWallet,
}: CrossChainTransferTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Source Chain */}
      <div suppressHydrationWarning>
        <ChainSelector
          chains={SUPPORTED_BRIDGE_CHAINS} // All supported chains
          label="From Chain"
          selectedChain={selectedSourceChain}
          onChainSelect={onSourceChainSelect}
        />
      </div>

      {/* Destination Chain */}
      <div suppressHydrationWarning>
        <ChainSelector
          chains={SUPPORTED_BRIDGE_CHAINS} // All supported chains
          label="To Chain"
          selectedChain={selectedDestinationChain}
          onChainSelect={onDestinationChainSelect}
        />
      </div>

      {/* Recipient Address */}
      <AddressInput
        address={recipientAddress}
        label="Recipient Address"
        placeholder="0x..."
        onAddressChange={onRecipientAddressChange}
      />

      {/* Amount Input */}
      <TokenAmountInput
        amount={bridgeAmount}
        balance={iu2uBalance}
        maxAmount={iu2uBalance}
        symbol="IU2U"
        onAmountChange={onBridgeAmountChange}
      />

      {/* Transfer Button */}
      {isConnected ? (
        !isSourceChainCurrent && selectedSourceChain ? (
          <BridgeActionButton
            disabled={isSwitchingChain}
            loading={isSwitchingChain}
            onClick={onSwitchToSourceChain}
          >
            Switch to {selectedSourceChain.name}
          </BridgeActionButton>
        ) : (
          <BridgeActionButton
            disabled={
              !selectedDestinationChain ||
              !recipientAddress ||
              !bridgeAmount ||
              isLoading
            }
            loading={isLoading}
            onClick={onSendToken}
          >
            Send IU2U Cross-Chain
          </BridgeActionButton>
        )
      ) : (
        <BridgeActionButton
          disabled={false}
          loading={false}
          onClick={onConnectWallet || (() => {})}
        >
          Connect Wallet to Transfer
        </BridgeActionButton>
      )}
    </div>
  );
}
