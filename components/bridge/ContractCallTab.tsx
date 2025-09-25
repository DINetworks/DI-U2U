import { Chain } from "viem";

import ChainSelector from "./ChainSelector";
import AddressInput from "./AddressInput";
import TokenAmountInput from "./TokenAmountInput";
import BridgeActionButton from "./BridgeActionButton";

import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";

interface ContractCallTabProps {
  selectedSourceChain: Chain | null;
  onSourceChainSelect: (chain: Chain) => void;
  selectedDestinationChain: Chain | null;
  onDestinationChainSelect: (chain: Chain) => void;
  contractAddress: string;
  onContractAddressChange: (address: string) => void;
  payload: string;
  onPayloadChange: (payload: string) => void;
  isContractCall: boolean;
  onContractCallChange: (isContractCall: boolean) => void;
  callAmount: string;
  onCallAmountChange: (amount: string) => void;
  iu2uBalance: string;
  onContractCall: () => void;
  isLoading: boolean;
  isConnected: boolean;
  isSourceChainCurrent: boolean;
  isSwitchingChain: boolean;
  onSwitchToSourceChain: () => void;
}

export default function ContractCallTab({
  selectedSourceChain,
  onSourceChainSelect,
  selectedDestinationChain,
  onDestinationChainSelect,
  contractAddress,
  onContractAddressChange,
  payload,
  onPayloadChange,
  isContractCall,
  onContractCallChange,
  callAmount,
  onCallAmountChange,
  iu2uBalance,
  onContractCall,
  isLoading,
  isConnected,
  isSourceChainCurrent,
  isSwitchingChain,
  onSwitchToSourceChain,
}: ContractCallTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Source Chain */}
      <div suppressHydrationWarning>
        <ChainSelector
          chains={SUPPORTED_BRIDGE_CHAINS.filter((chain) => chain.id === 2484)} // Only U2U for now
          label="From Chain"
          selectedChain={selectedSourceChain}
          onChainSelect={onSourceChainSelect}
        />
      </div>

      {/* Destination Chain */}
      <div suppressHydrationWarning>
        <ChainSelector
          chains={SUPPORTED_BRIDGE_CHAINS.filter((chain) => chain.id !== 2484)} // All except U2U
          label="To Chain"
          selectedChain={selectedDestinationChain}
          onChainSelect={onDestinationChainSelect}
        />
      </div>

      {/* Contract Address */}
      <AddressInput
        address={contractAddress}
        label="Contract Address"
        placeholder="0x..."
        onAddressChange={onContractAddressChange}
      />

      {/* Payload */}
      <div>
        <label
          className="block text-sm font-medium mb-2 text-white"
          htmlFor="function-call-data"
        >
          Function Call Data
        </label>
        <textarea
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="function-call-data"
          placeholder="0x..."
          rows={3}
          value={payload}
          onChange={(e) => onPayloadChange(e.target.value)}
        />
      </div>

      {/* Contract Call Options */}
      <div className="flex flex-col items-start gap-4">
        <label className="flex items-center gap-2 text-white">
          <input
            checked={isContractCall}
            className="rounded"
            type="checkbox"
            onChange={(e) => onContractCallChange(e.target.checked)}
          />
          Send IU2U with call
        </label>

        {isContractCall && (
          <TokenAmountInput
            amount={callAmount}
            balance={iu2uBalance}
            maxAmount={iu2uBalance}
            symbol="IU2U"
            onAmountChange={onCallAmountChange}
          />
        )}
      </div>

      {/* Contract Call Button */}
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
              !contractAddress ||
              !payload ||
              (isContractCall && !callAmount) ||
              isLoading
            }
            loading={isLoading}
            onClick={onContractCall}
          >
            {isContractCall && callAmount
              ? "Call Contract with IU2U"
              : "Call Contract"}
          </BridgeActionButton>
        )
      ) : (
        <BridgeActionButton
          disabled={false}
          loading={false}
          onClick={() => {
            /* TODO: Connect wallet */
          }}
        >
          Connect Wallet to Call Contract
        </BridgeActionButton>
      )}
    </div>
  );
}
