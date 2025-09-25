import { Select, SelectItem } from "@heroui/select";

import TokenAmountInput from "./TokenAmountInput";
import BridgeActionButton from "./BridgeActionButton";

interface DepositWithdrawTabProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  isDepositMode: boolean;
  onDepositModeChange: (isDeposit: boolean) => void;
  displayBalance: string;
  displayBalanceLoading: boolean;
  displayTokenSymbol: string;
  onDeposit: () => void;
  onWithdraw: () => void;
  isLoading: boolean;
  isConnected: boolean;
  onConnectWallet?: () => void;
}

export default function DepositWithdrawTab({
  amount,
  onAmountChange,
  isDepositMode,
  onDepositModeChange,
  displayBalance,
  displayBalanceLoading,
  displayTokenSymbol,
  onDeposit,
  onWithdraw,
  isLoading,
  isConnected,
  onConnectWallet,
}: DepositWithdrawTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Chain Info (Fixed) */}
      <div className="bg-default-100 rounded-xl p-3">
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-300">
          <span className="font-medium">Chain:</span>
          <span>U2U Nebulas Testnet (Fixed)</span>
        </div>
      </div>

      {/* Operation Type Selector */}
      <div>
        <label
          className="block text-sm font-medium mb-2 text-white"
          htmlFor="operation-type-select"
          id="operation-type-label"
        >
          Operation Type
        </label>
        <Select
          aria-labelledby="operation-type-label"
          className="w-full"
          id="operation-type-select"
          placeholder="Select operation"
          selectedKeys={new Set([isDepositMode ? "deposit" : "withdraw"])}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;

            onDepositModeChange(selected === "deposit");
          }}
        >
          <SelectItem key="deposit" textValue="Deposit U2U → IU2U">
            <div className="flex items-center gap-2">
              <span>Deposit U2U → IU2U</span>
              <span className="text-xs text-gray-400">
                (Native U2U to IU2U Token)
              </span>
            </div>
          </SelectItem>
          <SelectItem key="withdraw" textValue="Withdraw IU2U → U2U">
            <div className="flex items-center gap-2">
              <span>Withdraw IU2U → U2U</span>
              <span className="text-xs text-gray-400">
                (IU2U Token to Native U2U)
              </span>
            </div>
          </SelectItem>
        </Select>
      </div>

      {/* Amount Input */}
      <TokenAmountInput
        amount={amount}
        balance={displayBalance}
        label={`Amount (${displayTokenSymbol})`}
        maxAmount={displayBalance}
        symbol={displayTokenSymbol}
        onAmountChange={onAmountChange}
      />

      {/* Action Button */}
      <div className="flex gap-4">
        {isConnected ? (
          <BridgeActionButton
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            loading={isLoading}
            onClick={isDepositMode ? onDeposit : onWithdraw}
          >
            {isDepositMode ? "Deposit U2U → IU2U" : "Withdraw IU2U → U2U"}
          </BridgeActionButton>
        ) : (
          <BridgeActionButton
            disabled={false}
            loading={false}
            onClick={onConnectWallet || (() => {})}
          >
            Connect Wallet to Perform Operation
          </BridgeActionButton>
        )}
      </div>
    </div>
  );
}
