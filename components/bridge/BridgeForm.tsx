import { useState, useEffect } from "react";
import { Chain } from "viem";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";

import DepositWithdrawTab from "./DepositWithdrawTab";
import CrossChainTransferTab from "./CrossChainTransferTab";
import ContractCallTab from "./ContractCallTab";

import { useWeb3 } from "@/hooks/useWeb3";
import { useIU2UBalance, useNativeU2UBalance } from "@/hooks/useIU2U";
import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";
import { useBridgeChainSwitching } from "@/hooks/useBridgeChainSwitching";
import { UseBridgeTransactionsReturn } from "@/hooks/useBridgeTransactions";

interface BridgeFormProps {
  onConnectWallet?: () => void;
  bridgeTransactions: UseBridgeTransactionsReturn; // Use the same type as returned by useBridgeTransactions
}

export default function BridgeForm({
  onConnectWallet,
  bridgeTransactions,
}: BridgeFormProps) {
  const { isConnected, chain, address } = useWeb3();

  // Bridge state
  const [selectedSourceChain, setSelectedSourceChain] = useState<Chain | null>(
    null,
  );
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState<Chain | null>(null);
  const [amount, setAmount] = useState("");
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [callAmount, setCallAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [contractAddress, setContractAddress] = useState("");
  const [payload, setPayload] = useState("");
  const [isDepositMode, setIsDepositMode] = useState(true);
  const [isContractCall, setIsContractCall] = useState(false);
  const [activeTab, setActiveTab] = useState("operations");

  // IU2U hooks
  const {
    formattedBalance: iu2uBalance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useIU2UBalance(chain?.id || 0);
  const {
    formattedBalance: nativeU2UBalance,
    isLoading: nativeBalanceLoading,
  } = useNativeU2UBalance();

  // Custom hooks
  const { isSwitchingChain, switchToChain } = useBridgeChainSwitching();

  // Determine which balance to show based on active tab
  const displayBalance = isDepositMode ? nativeU2UBalance : iu2uBalance;
  const displayBalanceLoading = isDepositMode
    ? nativeBalanceLoading
    : balanceLoading;
  const displayTokenSymbol = isDepositMode ? "U2U" : "IU2U";

  const {
    formattedBalance: iu2uBalanceInSourceChain
  } = useIU2UBalance(selectedSourceChain?.id || 0);

  // Check if source chain matches current chain
  const isSourceChainCurrent =
    !!selectedSourceChain && !!chain && selectedSourceChain.id === chain.id;

  // Initialize default chains
  useEffect(() => {
    if (SUPPORTED_BRIDGE_CHAINS.length > 0) {
      setSelectedSourceChain(SUPPORTED_BRIDGE_CHAINS[0]); // U2U Solaris Mainnet
      setSelectedDestinationChain(SUPPORTED_BRIDGE_CHAINS[2]); // Polygon
    }
  }, []);

  // Fix source chain to U2U testnet for deposit/withdraw operations
  useEffect(() => {
    if (activeTab === "operations" && SUPPORTED_BRIDGE_CHAINS.length > 0) {
      setSelectedSourceChain(SUPPORTED_BRIDGE_CHAINS[0]); // Always U2U Solaris Mainnet
    }
  }, [activeTab]);

  // Set recipient address to connected wallet address by default
  useEffect(() => {
    if (address && !recipientAddress) {
      setRecipientAddress(address);
    }
  }, [address, recipientAddress]);

  // Handle chain switching
  const handleSwitchToSourceChain = async () => {
    if (selectedSourceChain && !isSourceChainCurrent) {
      await switchToChain(selectedSourceChain);
    }
  };

  // Transaction handlers
  const handleDeposit = async () => {
    await bridgeTransactions.executeDeposit(amount);
    setAmount("");
    refetchBalance();
  };

  const handleWithdraw = async () => {
    await bridgeTransactions.executeWithdraw(amount);
    setAmount("");
    refetchBalance();
  };

  const handleSendToken = async () => {
    if (!selectedDestinationChain) return;

    await bridgeTransactions.executeSendToken(
      selectedDestinationChain,
      recipientAddress,
      bridgeAmount,
    );
    setBridgeAmount("");
    setRecipientAddress("");
    refetchBalance();
  };

  const handleContractCall = async () => {
    if (!selectedDestinationChain) return;

    await bridgeTransactions.executeContractCall(
      selectedDestinationChain,
      contractAddress,
      payload,
      isContractCall ? callAmount : undefined,
    );
    setCallAmount("");
    setContractAddress("");
    setPayload("");
    refetchBalance();
  };

  return (
    <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-8">
      <CardHeader>
        <h2 className="text-2xl font-bold text-white">Bridge Operations</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <Tabs
          className="w-full"
          destroyInactiveTabPanel={false}
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
        >
          <Tab key="operations" title="Deposit/Withdraw">
            <DepositWithdrawTab
              amount={amount}
              displayBalance={displayBalance}
              displayBalanceLoading={displayBalanceLoading}
              displayTokenSymbol={displayTokenSymbol}
              isConnected={isConnected}
              isDepositMode={isDepositMode}
              isLoading={bridgeTransactions.transactions.some(
                (tx) => tx.status === "pending",
              )}
              onAmountChange={setAmount}
              onConnectWallet={onConnectWallet}
              onDeposit={handleDeposit}
              onDepositModeChange={setIsDepositMode}
              onWithdraw={handleWithdraw}
            />
          </Tab>

          <Tab key="transfer" title="Cross-Chain Transfer">
            <CrossChainTransferTab
              bridgeAmount={bridgeAmount}
              isConnected={isConnected}
              isLoading={bridgeTransactions.transactions.some(
                (tx) => tx.status === "pending",
              )}
              isSourceChainCurrent={isSourceChainCurrent}
              isSwitchingChain={isSwitchingChain}
              iu2uBalance={iu2uBalanceInSourceChain}
              recipientAddress={recipientAddress}
              selectedDestinationChain={selectedDestinationChain}
              selectedSourceChain={selectedSourceChain}
              onBridgeAmountChange={setBridgeAmount}
              onConnectWallet={onConnectWallet}
              onDestinationChainSelect={setSelectedDestinationChain}
              onRecipientAddressChange={setRecipientAddress}
              onSendToken={handleSendToken}
              onSourceChainSelect={setSelectedSourceChain}
              onSwitchToSourceChain={handleSwitchToSourceChain}
            />
          </Tab>

          <Tab key="contract" title="Contract Call">
            <ContractCallTab
              callAmount={callAmount}
              contractAddress={contractAddress}
              isConnected={isConnected}
              isContractCall={isContractCall}
              isLoading={bridgeTransactions.transactions.some(
                (tx) => tx.status === "pending",
              )}
              isSourceChainCurrent={isSourceChainCurrent}
              isSwitchingChain={isSwitchingChain}
              iu2uBalance={iu2uBalance}
              payload={payload}
              selectedDestinationChain={selectedDestinationChain}
              selectedSourceChain={selectedSourceChain}
              onCallAmountChange={setCallAmount}
              onContractAddressChange={setContractAddress}
              onContractCall={handleContractCall}
              onContractCallChange={setIsContractCall}
              onDestinationChainSelect={setSelectedDestinationChain}
              onPayloadChange={setPayload}
              onSourceChainSelect={setSelectedSourceChain}
              onSwitchToSourceChain={handleSwitchToSourceChain}
            />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
