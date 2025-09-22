// IU2U Bridge Page
import { Chain } from "viem";
import { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { useWaitForTransactionReceipt } from "wagmi";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useWeb3 } from "@/hooks/useWeb3";
import {
  useIU2UBalance,
  useIU2UTokenOperations,
  useIU2UGatewayOperations,
  useNativeU2UBalance,
} from "@/hooks/useIU2U";
import { SUPPORTED_BRIDGE_CHAINS } from "@/config/bridge";
import { BridgeTransaction } from "@/types/bridge";
import ChainSelector from "@/components/bridge/ChainSelector";
import TokenAmountInput from "@/components/bridge/TokenAmountInput";
import AddressInput from "@/components/bridge/AddressInput";
import BridgeActionButton from "@/components/bridge/BridgeActionButton";
import BridgeTransactionHistory from "@/components/bridge/BridgeTransactionHistory";
import { useWalletModal } from "@/contexts/WalletContext";
import BridgeInfoDrawer from "@/components/bridge/BridgeInfoDrawer";
import BridgeFirstTimeGuide from "@/components/bridge/BridgeFirstTimeGuide";
import BridgeTransactionCompleteDialog from "@/components/bridge/BridgeTransactionCompleteDialog";

const BridgePage: NextPage = () => {
  const { isConnected, address, chain } = useWeb3();

  // Bridge state
  const [selectedSourceChain, setSelectedSourceChain] = useState<Chain | null>(
    null,
  );
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState<Chain | null>(null);
  const [amount, setAmount] = useState("");
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [callAmount, setCallAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState(address);
  const [contractAddress, setContractAddress] = useState("");
  const [payload, setPayload] = useState("");
  const [isDepositMode, setIsDepositMode] = useState(true);
  const [isContractCall, setIsContractCall] = useState(false);
  const [activeTab, setActiveTab] = useState("operations");
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isFirstTimeGuideOpen, setIsFirstTimeGuideOpen] = useState(false);
  const [isTransactionCompleteDialogOpen, setIsTransactionCompleteDialogOpen] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<BridgeTransaction | null>(null);
  const [pendingTransactionHashes, setPendingTransactionHashes] = useState<string[]>([]);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);
  const { openConnectModal } = useWalletModal();

  // IU2U hooks
  const {
    formattedBalance: iu2uBalance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useIU2UBalance();
  const {
    formattedBalance: nativeU2UBalance,
    isLoading: nativeBalanceLoading,
  } = useNativeU2UBalance();
  const tokenOps = useIU2UTokenOperations();
  const gatewayOps = useIU2UGatewayOperations();

  // Get txHash from the hooks
  const tokenTxHash = tokenOps.txHash;
  const gatewayTxHash = gatewayOps.txHash;

  // Watch for transaction confirmations
  const { isSuccess: isTxConfirmed, data: txReceipt } = useWaitForTransactionReceipt({
    hash: pendingTransactionHashes[0] as `0x${string}` | undefined,
  });

  // Determine which balance to show based on active tab
  const displayBalance = isDepositMode ? nativeU2UBalance : iu2uBalance;
  const displayBalanceLoading = isDepositMode
    ? nativeBalanceLoading
    : balanceLoading;
  const displayTokenSymbol = isDepositMode ? "U2U" : "IU2U";

  // Initialize default chains
  useEffect(() => {
    if (SUPPORTED_BRIDGE_CHAINS.length > 0) {
      setSelectedSourceChain(SUPPORTED_BRIDGE_CHAINS[0]); // U2U Nebulas Testnet
      setSelectedDestinationChain(SUPPORTED_BRIDGE_CHAINS[1]); // Polygon
    }
  }, []);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('bridge-transactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed);
      } catch (error) {
        console.error('Failed to parse saved transactions:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('bridge-transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Watch for transaction hash and update pending transaction
  useEffect(() => {
    const currentTxHash = tokenTxHash || gatewayTxHash;
    if (currentTxHash && lastTransactionId) {
      // Update transaction with hash
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === lastTransactionId
            ? { ...tx, txHash: currentTxHash, status: "pending" as const }
            : tx
        )
      );

      // Add to pending transactions to watch for confirmation
      setPendingTransactionHashes((prev) => [...prev, currentTxHash]);

      // Reset last transaction ID
      setLastTransactionId(null);
    }
  }, [tokenTxHash, gatewayTxHash, lastTransactionId]);

  // Watch for transaction confirmations and update status
  useEffect(() => {
    if (isTxConfirmed && txReceipt && pendingTransactionHashes.length > 0) {
      const confirmedHash = pendingTransactionHashes[0];

      // Update transaction status to completed
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.txHash === confirmedHash
            ? { ...tx, status: "completed" as const }
            : tx
        )
      );

      // Find the completed transaction and show dialog
      const completedTx = transactions.find((tx) => tx.txHash === confirmedHash);
      if (completedTx) {
        setCompletedTransaction({ ...completedTx, status: "completed" });
        setIsTransactionCompleteDialogOpen(true);
      }

      // Remove from pending hashes
      setPendingTransactionHashes((prev) => prev.slice(1));
    }
  }, [isTxConfirmed, txReceipt, pendingTransactionHashes, transactions]);

  // Fix source chain to U2U testnet for deposit/withdraw operations
  useEffect(() => {
    if (activeTab === "deposit" && SUPPORTED_BRIDGE_CHAINS.length > 0) {
      setSelectedSourceChain(SUPPORTED_BRIDGE_CHAINS[0]); // Always U2U Nebulas Testnet
    }
  }, [activeTab]);

  // Handle deposit U2U -> IU2U
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Add transaction to history with pending status
    const transactionId = Date.now().toString();
    const transaction: BridgeTransaction = {
      id: transactionId,
      type: "deposit",
      sourceChain: selectedSourceChain?.name || "",
      amount,
      symbol: "IU2U",
      status: "pending",
      timestamp: Date.now(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setLastTransactionId(transactionId);

    try {
      await tokenOps.deposit(amount);

      console.log("Deposit initiated");

      // Reset form
      setAmount("");
      refetchBalance();
    } catch (error) {
      console.error("Deposit failed:", error);

      // Update transaction status to failed
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? { ...tx, status: "failed" as const }
            : tx
        )
      );

      // Show failed transaction dialog
      const failedTx = { ...transaction, status: "failed" as const };
      setCompletedTransaction(failedTx);
      setIsTransactionCompleteDialogOpen(true);
      setLastTransactionId(null);
    }
  };

  // Handle withdraw IU2U -> U2U
  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    // Add transaction to history with pending status
    const transactionId = Date.now().toString();
    const transaction: BridgeTransaction = {
      id: transactionId,
      type: "withdraw",
      sourceChain: selectedSourceChain?.name || "",
      amount,
      symbol: "IU2U",
      status: "pending",
      timestamp: Date.now(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setLastTransactionId(transactionId);

    try {
      await tokenOps.withdraw(amount);
      
      setAmount("");
      refetchBalance();
    } catch (error) {
      console.error("Withdrawal failed:", error);

      // Update transaction status to failed
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? { ...tx, status: "failed" as const }
            : tx
        )
      );

      // Show failed transaction dialog
      const failedTx = { ...transaction, status: "failed" as const };
      setCompletedTransaction(failedTx);
      setIsTransactionCompleteDialogOpen(true);
      setLastTransactionId(null);
    }
  };

  // Handle cross-chain token transfer
  const handleSendToken = async () => {
    if (!selectedDestinationChain || !recipientAddress || !bridgeAmount) return;

    // Add transaction to history with pending status
    const transactionId = Date.now().toString();
    const transaction: BridgeTransaction = {
      id: transactionId,
      type: "sendToken",
      sourceChain: selectedSourceChain?.name || "",
      destinationChain: selectedDestinationChain.name,
      recipient: recipientAddress,
      amount: bridgeAmount,
      symbol: "IU2U",
      status: "pending",
      timestamp: Date.now(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setLastTransactionId(transactionId);

    try {
      await gatewayOps.sendToken(
        selectedDestinationChain.name,
        recipientAddress,
        "IU2U",
        bridgeAmount,
      );

      console.log("Cross-chain transfer initiated");

      // Reset form
      setBridgeAmount("");
      setRecipientAddress("");
      refetchBalance();
    } catch (error) {
      console.error("Cross-chain transfer failed:", error);

      // Update transaction status to failed
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? { ...tx, status: "failed" as const }
            : tx
        )
      );

      // Show failed transaction dialog
      const failedTx = { ...transaction, status: "failed" as const };
      setCompletedTransaction(failedTx);
      setIsTransactionCompleteDialogOpen(true);
      setLastTransactionId(null);
    }
  };

  // Handle contract call
  const handleContractCall = async () => {
    if (!selectedDestinationChain || !contractAddress || !payload) return;

    // Add transaction to history with pending status
    const transactionId = Date.now().toString();
    const transaction: BridgeTransaction = {
      id: transactionId,
      type:
        isContractCall && callAmount
          ? "callContractWithToken"
          : "callContract",
      sourceChain: selectedSourceChain?.name || "",
      destinationChain: selectedDestinationChain.name,
      contractAddress,
      amount: isContractCall && callAmount ? callAmount : "",
      symbol: "IU2U",
      status: "pending",
      timestamp: Date.now(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setLastTransactionId(transactionId);

    try {
      if (isContractCall && callAmount) {
        await gatewayOps.callContractWithToken(
          selectedDestinationChain.name,
          contractAddress,
          payload,
          "IU2U",
          callAmount,
        );
      } else {
        await gatewayOps.callContract(
          selectedDestinationChain.name,
          contractAddress,
          payload,
        );
      }

      console.log("Contract call initiated");

      // Reset form
      setCallAmount("");
      setContractAddress("");
      setPayload("");
      refetchBalance();
    } catch (error) {
      console.error("Contract call failed:", error);

      // Update transaction status to failed
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId
            ? { ...tx, status: "failed" as const }
            : tx
        )
      );

      // Show failed transaction dialog
      const failedTx = { ...transaction, status: "failed" as const };
      setCompletedTransaction(failedTx);
      setIsTransactionCompleteDialogOpen(true);
      setLastTransactionId(null);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>IU2U Bridge - Cross-Chain Token Transfers</title>
        <meta
          content="Bridge IU2U tokens across multiple EVM-compatible blockchains"
          name="description"
        />
      </Head>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col bg-black/2 items-center justify-center gap-4 py-6 md:py-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="inline-block max-w-4xl text-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4">
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              IU2U Cross-Chain Bridge
            </h1>
            <div className="flex items-center gap-2">
              <motion.button
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
                title="Help & Information"
                transition={{
                  rotate: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsInfoDrawerOpen(true)}
              >
                <svg
                  className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </motion.button>

              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
                title="First Time Guide"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFirstTimeGuideOpen(true)}
              >
                <svg
                  className="w-6 h-6 text-white group-hover:text-green-300 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </motion.button>
            </div>
          </div>
          <h2 className={subtitle({ class: "mt-4 text-gray-300" })}>
            Transfer IU2U tokens seamlessly across multiple blockchains
          </h2>
        </motion.div>

        <div className="w-full grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-white">
                    Bridge Operations
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {/* Operation Type Tabs */}
                  <Tabs
                    className="w-full"
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    destroyInactiveTabPanel={false}
                  >
                    <Tab key="operations" title="Deposit/Withdraw">
                      <div className="space-y-4 mt-4">
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
                            selectedKeys={
                              new Set([isDepositMode ? "deposit" : "withdraw"])
                            }
                            onSelectionChange={(keys) => {
                              const selected = Array.from(keys)[0] as string;

                              setIsDepositMode(selected === "deposit");
                            }}
                          >
                            <SelectItem
                              key="deposit"
                              textValue="Deposit U2U → IU2U"
                            >
                              <div className="flex items-center gap-2">
                                <span>Deposit U2U → IU2U</span>
                                <span className="text-xs text-gray-400">
                                  (Native U2U to IU2U Token)
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem
                              key="withdraw"
                              textValue="Withdraw IU2U → U2U"
                            >
                              <div className="flex items-center gap-2">
                                <span>Withdraw IU2U → U2U</span>
                                <span className="text-xs text-gray-400">
                                  (IU2U Token to Native U2U)
                                </span>
                              </div>
                            </SelectItem>
                          </Select>
                        </div>

                        {/* Chain Selector */}
                        <div suppressHydrationWarning>
                          <ChainSelector
                            disabled
                            chains={SUPPORTED_BRIDGE_CHAINS}
                            label="Chain (Fixed to U2U Testnet)"
                            selectedChain={selectedSourceChain}
                            onChainSelect={setSelectedSourceChain}
                          />
                        </div>

                        {/* Amount Input */}
                        <TokenAmountInput
                          amount={amount}
                          balance={displayBalance}
                          label={`Amount (${displayTokenSymbol})`}
                          maxAmount={displayBalance}
                          symbol={displayTokenSymbol}
                          onAmountChange={setAmount}
                        />

                        {/* Action Button */}
                        <div className="flex gap-4">
                          {isConnected ? (
                            <BridgeActionButton
                              disabled={
                                !amount ||
                                parseFloat(amount) <= 0 ||
                                tokenOps.isLoading
                              }
                              loading={tokenOps.isLoading}
                              onClick={
                                isDepositMode ? handleDeposit : handleWithdraw
                              }
                            >
                              {isDepositMode
                                ? "Deposit U2U → IU2U"
                                : "Withdraw IU2U → U2U"}
                            </BridgeActionButton>
                          ) : (
                            <BridgeActionButton
                              disabled={false}
                              loading={false}
                              onClick={() => {
                                /* TODO: Connect wallet */
                              }}
                            >
                              Connect Wallet to Perform Operation
                            </BridgeActionButton>
                          )}
                        </div>
                      </div>
                    </Tab>

                    <Tab key="transfer" title="Cross-Chain Transfer">
                      <div className="space-y-4 mt-4">
                        {/* Source Chain */}
                        <div suppressHydrationWarning>
                          <ChainSelector
                            chains={SUPPORTED_BRIDGE_CHAINS}
                            label="From Chain"
                            selectedChain={selectedSourceChain}
                            onChainSelect={setSelectedSourceChain}
                          />
                        </div>

                        {/* Destination Chain */}
                        <div suppressHydrationWarning>
                          <ChainSelector
                            chains={SUPPORTED_BRIDGE_CHAINS}
                            label="To Chain"
                            selectedChain={selectedDestinationChain}
                            onChainSelect={setSelectedDestinationChain}
                          />
                        </div>

                        {/* Recipient Address */}
                        <AddressInput
                          address={recipientAddress}
                          label="Recipient Address"
                          placeholder="0x..."
                          onAddressChange={setRecipientAddress}
                        />

                        {/* Amount Input */}
                        <TokenAmountInput
                          amount={bridgeAmount}
                          balance={iu2uBalance}
                          maxAmount={iu2uBalance}
                          symbol="IU2U"
                          onAmountChange={setBridgeAmount}
                        />

                        {/* Transfer Button */}
                        {isConnected ? (
                          <BridgeActionButton
                            disabled={
                              !selectedDestinationChain ||
                              !recipientAddress ||
                              !bridgeAmount ||
                              gatewayOps.isLoading
                            }
                            loading={gatewayOps.isLoading}
                            onClick={handleSendToken}
                          >
                            Send IU2U Cross-Chain
                          </BridgeActionButton>
                        ) : (
                          <BridgeActionButton
                            disabled={false}
                            loading={false}
                            onClick={() => {
                              /* TODO: Connect wallet */
                            }}
                          >
                            Connect Wallet to Transfer
                          </BridgeActionButton>
                        )}
                      </div>
                    </Tab>

                    <Tab key="contract" title="Contract Call">
                      <div className="space-y-4 mt-4">
                        {/* Source Chain */}
                        <div suppressHydrationWarning>
                          <ChainSelector
                            chains={SUPPORTED_BRIDGE_CHAINS}
                            label="From Chain"
                            selectedChain={selectedSourceChain}
                            onChainSelect={setSelectedSourceChain}
                          />
                        </div>

                        {/* Destination Chain */}
                        <div suppressHydrationWarning>
                          <ChainSelector
                            chains={SUPPORTED_BRIDGE_CHAINS}
                            label="To Chain"
                            selectedChain={selectedDestinationChain}
                            onChainSelect={setSelectedDestinationChain}
                          />
                        </div>

                        {/* Contract Address */}
                        <AddressInput
                          address={contractAddress}
                          label="Contract Address"
                          placeholder="0x..."
                          onAddressChange={setContractAddress}
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
                            onChange={(e) => setPayload(e.target.value)}
                          />
                        </div>

                        {/* Contract Call Options */}
                        <div className="flex flex-col items-start gap-4">
                          <label className="flex items-center gap-2 text-white">
                            <input
                              checked={isContractCall}
                              className="rounded"
                              type="checkbox"
                              onChange={(e) =>
                                setIsContractCall(e.target.checked)
                              }
                            />
                            Send IU2U with call
                          </label>

                          {isContractCall && (
                            <TokenAmountInput
                              amount={callAmount}
                              balance={iu2uBalance}
                              maxAmount={iu2uBalance}
                              symbol="IU2U"
                              onAmountChange={setCallAmount}
                            />
                          )}
                        </div>

                        {/* Contract Call Button */}
                        {isConnected ? (
                          <BridgeActionButton
                            disabled={
                              !selectedDestinationChain ||
                              !contractAddress ||
                              !payload ||
                              (isContractCall && !callAmount) ||
                              gatewayOps.isLoading
                            }
                            loading={gatewayOps.isLoading}
                            onClick={handleContractCall}
                          >
                            {isContractCall && callAmount
                              ? "Call Contract with IU2U"
                              : "Call Contract"}
                          </BridgeActionButton>
                        ) : (
                          <BridgeActionButton
                            disabled={false}
                            loading={false}
                            onClick={() => openConnectModal?.()}
                          >
                            Connect Wallet to Call Contract
                          </BridgeActionButton>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BridgeTransactionHistory
                transactions={transactions}
                onTransactionClick={(tx: BridgeTransaction) =>
                  console.log("Transaction clicked:", tx)
                }
              />
            </motion.div>

            {/* Balance Display */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
                <CardBody className="text-center">
                  <div className="text-white">
                    <p className="text-sm opacity-75">U2U Balance</p>
                    <p className="text-2xl font-bold">
                      {isConnected ? (
                        displayBalanceLoading ? (
                          "..."
                        ) : (
                          `${parseFloat(nativeU2UBalance).toFixed(3)} U2U`
                        )
                      ) : (
                        <span className="text-gray-400 text-lg">
                          Connect wallet to view balance
                        </span>
                      )}
                    </p>
                    <p
                      suppressHydrationWarning
                      className="text-sm opacity-75 mt-2"
                    >
                      IU2U Balance ({chain?.name || "Not Connected"})
                    </p>
                    <p className="text-2xl font-bold">
                      {isConnected ? (
                        displayBalanceLoading ? (
                          "..."
                        ) : (
                          `${iu2uBalance} IU2U`
                        )
                      ) : (
                        <span className="text-gray-400 text-lg">
                          Connect wallet to view balance
                        </span>
                      )}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bridge Info Drawer */}
      <BridgeInfoDrawer
        isOpen={isInfoDrawerOpen}
        onClose={() => setIsInfoDrawerOpen(false)}
      />

      {/* Bridge First Time Guide */}
      <BridgeFirstTimeGuide
        isOpen={isFirstTimeGuideOpen}
        onClose={() => setIsFirstTimeGuideOpen(false)}
      />

      {/* Bridge Transaction Complete Dialog */}
      <BridgeTransactionCompleteDialog
        isOpen={isTransactionCompleteDialogOpen}
        onClose={() => {
          setIsTransactionCompleteDialogOpen(false);
          setCompletedTransaction(null);
        }}
        transaction={completedTransaction}
      />
    </DefaultLayout>
  );
};

export default BridgePage;
