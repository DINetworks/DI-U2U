// IU2U Bridge Page - Modular and Refactored
import { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useWeb3 } from "@/hooks/useWeb3";
import { useIU2UBalance, useNativeU2UBalance } from "@/hooks/useIU2U";
import { useBridgeTransactions } from "@/hooks/useBridgeTransactions";
import { useBridgePolling } from "@/hooks/useBridgePolling";
import BridgeForm from "@/components/bridge/BridgeForm";
import BridgeTransactionHistory from "@/components/bridge/BridgeTransactionHistory";
import { useWalletModal } from "@/contexts/WalletContext";
import BridgeInfoDrawer from "@/components/bridge/BridgeInfoDrawer";
import BridgeFirstTimeGuide from "@/components/bridge/BridgeFirstTimeGuide";
import BridgeTransactionCompleteDialog from "@/components/bridge/BridgeTransactionCompleteDialog";
import BridgeTransactionStatusDialog from "@/components/bridge/BridgeTransactionStatusDialog";

const BridgePage: NextPage = () => {
  const { isConnected, chain } = useWeb3();

  // UI state
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isFirstTimeGuideOpen, setIsFirstTimeGuideOpen] = useState(false);
  const [isTransactionCompleteDialogOpen, setIsTransactionCompleteDialogOpen] =
    useState(false);
  const [isTransactionStatusDialogOpen, setIsTransactionStatusDialogOpen] =
    useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);
  const [statusTransaction, setStatusTransaction] = useState<any>(null);

  const { openConnectModal } = useWalletModal();

  // Custom hooks for modular functionality
  const bridgeTransactions = useBridgeTransactions();

  // Use polling hook for transaction status updates
  useBridgePolling({
    transactions: bridgeTransactions.transactions,
    pendingTransactionHashes: bridgeTransactions.pendingTransactionHashes,
    lastTransactionId: bridgeTransactions.lastTransactionId,
    crossChainTransactions: bridgeTransactions.crossChainTransactions,
    updateTransaction: bridgeTransactions.updateTransaction,
    addPendingTransactionHash: bridgeTransactions.addPendingTransactionHash,
    removePendingTransactionHash:
      bridgeTransactions.removePendingTransactionHash,
    addCrossChainTransaction: bridgeTransactions.addCrossChainTransaction,
    removeCrossChainTransaction: bridgeTransactions.removeCrossChainTransaction,
    setLastTransactionId: bridgeTransactions.setLastTransactionId,
  });

  // Watch for transactions that need status dialogs
  useEffect(() => {
    const pendingCrossChainTx = bridgeTransactions.transactions.find(
      (tx) =>
        tx.status === "pending" &&
        (tx.type === "sendToken" ||
          tx.type === "callContract" ||
          tx.type === "callContractWithToken"),
    );

    const completedTx = bridgeTransactions.transactions.find(
      (tx) => tx.status === "completed",
    );

    // Show status dialog for pending cross-chain transactions
    if (
      pendingCrossChainTx &&
      !isTransactionStatusDialogOpen &&
      !isTransactionCompleteDialogOpen
    ) {
      setStatusTransaction(pendingCrossChainTx);
      setIsTransactionStatusDialogOpen(true);
    }

    // Show appropriate dialog for completed transactions that haven't shown their dialog yet
    if (
      completedTx &&
      !completedTx.dialogShown &&
      !isTransactionCompleteDialogOpen &&
      !isTransactionStatusDialogOpen
    ) {
      // For cross-chain transactions, use the status dialog which shows progress
      const isCrossChain =
        completedTx.type === "sendToken" ||
        completedTx.type === "callContract" ||
        completedTx.type === "callContractWithToken";

      if (isCrossChain) {
        setStatusTransaction(completedTx);
        setIsTransactionStatusDialogOpen(true);
      } else {
        setCompletedTransaction(completedTx);
        setIsTransactionCompleteDialogOpen(true);
      }

      refetchIU2UBalance();
      refetchNativeU2UBalance();
    }

    // Update the statusTransaction if it's currently open and the transaction data has changed
    if (isTransactionStatusDialogOpen && statusTransaction) {
      const updatedTx = bridgeTransactions.transactions.find(
        (tx) => tx.id === statusTransaction.id,
      );

      if (
        updatedTx &&
        (updatedTx.commandId !== statusTransaction.commandId ||
          updatedTx.status !== statusTransaction.status ||
          updatedTx.destinationTxHash !== statusTransaction.destinationTxHash)
      ) {
        setStatusTransaction(updatedTx);
      }
    }
  }, [
    bridgeTransactions.transactions,
    isTransactionCompleteDialogOpen,
    isTransactionStatusDialogOpen,
    statusTransaction,
  ]);

  // Balances for display
  const {
    formattedBalance: iu2uBalance,
    isLoading: balanceLoading,
    refetch: refetchIU2UBalance,
  } = useIU2UBalance();
  const {
    formattedBalance: nativeU2UBalance,
    isLoading: nativeBalanceLoading,
    refetch: refetchNativeU2UBalance,
  } = useNativeU2UBalance();

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
              <BridgeForm
                bridgeTransactions={bridgeTransactions}
                onConnectWallet={openConnectModal || undefined}
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BridgeTransactionHistory
                transactions={bridgeTransactions.transactions}
                onTransactionClick={(tx) =>
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
                        nativeBalanceLoading ? (
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
                        balanceLoading ? (
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
        transaction={completedTransaction}
        onClose={() => {
          // Mark the transaction as dialog shown to prevent reopening
          if (completedTransaction) {
            bridgeTransactions.updateTransaction(completedTransaction.id, {
              dialogShown: true,
            });
          }
          setIsTransactionCompleteDialogOpen(false);
          setCompletedTransaction(null);
        }}
      />

      {/* Bridge Transaction Status Dialog */}
      <BridgeTransactionStatusDialog
        isOpen={isTransactionStatusDialogOpen}
        transaction={statusTransaction}
        onClose={() => {
          // Mark the transaction as dialog shown to prevent reopening
          if (statusTransaction) {
            bridgeTransactions.updateTransaction(statusTransaction.id, {
              dialogShown: true,
            });
          }
          setIsTransactionStatusDialogOpen(false);
          setStatusTransaction(null);
        }}
      />
    </DefaultLayout>
  );
};

export default BridgePage;
