import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Address, formatEther, maxUint256 } from "viem";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useGaslessContracts } from "@/hooks/useGaslessContracts";
import { useCredit } from "@/hooks/useCredit";
import GaslessBatchTransfer from "@/components/metatx/GaslessBatchTransfer";
import ContractsInfo from "@/components/metatx/ContractsInfo";
import GasCreditCard from "@/components/metatx/GasCreditCard";
import ApprovedTokensCard from "@/components/metatx/ApprovedTokensCard";
import DepositDialog from "@/components/metatx/DepositDialog";
import WithdrawDialog from "@/components/metatx/WithdrawDialog";
import ApproveTokenDialog from "@/components/metatx/ApproveTokenDialog";
import DisapproveTokenDialog from "@/components/metatx/DisapproveTokenDialog";
import TransactionCompleteDialog from "@/components/metatx/TransactionCompleteDialog";
import InfoDrawer from "@/components/metatx/InfoDrawer";
import FirstTimeGuide from "@/components/metatx/FirstTimeGuide";
import { useTokensWithAllowances } from "@/hooks/useTokensWithAllowances";
import { useCreditTransactionHistory } from "@/hooks/useCreditTransactionHistory";
import { CONTRACT_ADDRESSES, CREDIT_TOKENS } from "@/config/web3";
import { TransactionResult } from "@/types/component";
import { useWaitForTransactionReceipt } from "wagmi";

const GATEWAY = CONTRACT_ADDRESSES.METATX_GATEWAY as Address;

export default function MetaTxPage() {
  const router = useRouter();
  const { vaultContract, contractInfo } = useGaslessContracts();
  const { formattedCredit, refetchCredit } = useCredit(vaultContract);
  const { approvedTokens, refetchAllowances, tokensInChain } =
    useTokensWithAllowances(GATEWAY);
  const { addTransaction } = useCreditTransactionHistory();

  // Dialog states
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDisapproveDialogOpen, setIsDisapproveDialogOpen] = useState(false);
  const [isTransactionCompleteDialogOpen, setIsTransactionCompleteDialogOpen] =
    useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [disapproveLoading, setDisapproveLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isFirstTimeGuideOpen, setIsFirstTimeGuideOpen] = useState(false);
  const [pendingCreditTx, setPendingCreditTx] = useState<TransactionResult | undefined>()

  const navigateToPage = (link: string) => {
    router.push(link);
  };

  const handleStartTransaction = () => {
    navigateToPage("/swap");
  };

  const { isSuccess: isCreditTxConfirmed, data: txReceipt } = useWaitForTransactionReceipt({
    hash: pendingCreditTx?.txHash as `0x${string}` | undefined,
  });

  const updateTransactionInfo = useCallback(async () => {
    if (pendingCreditTx) {
      const creditAfterRaw = await vaultContract.getCredits();
      const creditAfter = Number(formatEther(creditAfterRaw)).toFixed(3);
      
      addTransaction({
        ...pendingCreditTx,
        creditAfter,
        creditChanged: `${pendingCreditTx.type == 'deposit'? '+' : '-'} ${pendingCreditTx.amount}`
      });

      setTransactionResult(pendingCreditTx);

      refetchCredit();
      setIsTransactionCompleteDialogOpen(true);
      setPendingCreditTx(undefined)
    }
  }, [pendingCreditTx, vaultContract, refetchCredit, addTransaction])
  
  useEffect(() => {
    if (isCreditTxConfirmed && txReceipt && pendingCreditTx) {
      // Add to credit transaction history
      updateTransactionInfo();
    }

  }, [isCreditTxConfirmed, txReceipt, updateTransactionInfo])

  const handleDeposit = async (tokenAddress: Address, amount: bigint) => {
    if (!vaultContract) return;

    try {
      setDepositLoading(true);

      const creditBefore = formattedCredit;
      const tokenInfo = CREDIT_TOKENS?.find(
        (t) => t.address.toLowerCase() === tokenAddress.toLowerCase(),
      );

      const displayAmount = Number(formatEther(amount)).toFixed(3);
      const txHash = await vaultContract.deposit(tokenAddress, amount);

      setPendingCreditTx({
        type: "deposit",
        token: tokenInfo,
        amount: displayAmount,
        creditBefore,
        txHash
      })

    } catch (error) {
      console.error("Deposit failed:", error);
      throw error; // Re-throw to let dialog handle error display
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async (creditAmount: bigint) => {
    if (!vaultContract) return;

    try {
      setWithdrawLoading(true);

      // Capture credit before withdrawal
      const creditBefore = formattedCredit;
      const displayAmount = Number(formatEther(creditAmount)).toFixed(3);
      const txHash = await vaultContract.withdraw(creditAmount);

      setPendingCreditTx({
        type: "withdraw",
        amount: displayAmount,
        creditBefore,
        txHash
      })
    } catch (error) {
      console.error("Withdraw failed:", error);
      throw error; // Re-throw to let dialog handle error display
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleApproveToken = async (tokenAddress: `0x${string}`) => {
    if (!vaultContract) return;

    try {
      setApproveLoading(true);
      // Approve token for the gateway contract (max uint256 value)
      await vaultContract.approveForGateway(tokenAddress, maxUint256);
      // Refresh allowances and credit
      refetchAllowances();
      refetchCredit();
    } catch (error) {
      console.error("Token approval failed:", error);
      throw error;
    } finally {
      setApproveLoading(false);
    }
  };

  const handleApproveForVault = async (
    tokenAddress: `0x${string}`,
    amount: bigint,
  ) => {
    if (!vaultContract) return;

    try {
      // Use the vault contract's approve method for vault deposits
      await vaultContract.approve(tokenAddress, amount);
    } catch (error) {
      console.error("Vault approval failed:", error);
      throw error;
    }
  };

  const handleDisapproveToken = async (tokenAddress: `0x${string}`) => {
    if (!vaultContract) return;

    try {
      setDisapproveLoading(true);
      // Disapprove token for the gateway contract (set allowance to 0)
      await vaultContract.approveForGateway(tokenAddress, BigInt(0));
      // Refresh allowances and credit
      refetchAllowances();
      refetchCredit();
    } catch (error) {
      console.error("Token disapproval failed:", error);
      throw error;
    } finally {
      setDisapproveLoading(false);
    }
  };

  // Check if user has seen the first-time guide
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("metatx-guide-seen");

    console.log("Guide check - hasSeenGuide:", hasSeenGuide);

    // Show guide if user hasn't explicitly chosen "don't show again"
    if (hasSeenGuide !== "true") {
      console.log("Showing first-time guide");
      // Show guide after a short delay to let the page load
      const timer = setTimeout(() => {
        setIsFirstTimeGuideOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      console.log("Skipping guide - user chose not to show again");
    }
  }, []);

  // Debug function to reset guide (can be called from browser console)
  const resetGuide = () => {
    localStorage.removeItem("metatx-guide-seen");
    console.log("Guide reset - will show on next page load");
  };

  // Make resetGuide available globally for debugging
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).resetGuide = resetGuide;
    }
  }, []);

  return (
    <DefaultLayout>
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
              Gasless Meta-Transactions
            </h1>
            <motion.button
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
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
          </div>
          <h2 className={subtitle({ class: "mt-4 text-gray-300" })}>
            Pay Gas Fees in U2U Across All Chains
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
              <GaslessBatchTransfer
                approvedTokens={approvedTokens || []}
                credit={formattedCredit}
                onStartTransaction={handleStartTransaction}
              />
            </motion.div>
          </div>
          <div className="space-y-6">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContractsInfo />
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GasCreditCard
                credit={formattedCredit}
                onDeposit={() => setIsDepositDialogOpen(true)}
                onWithdraw={() => setIsWithdrawDialogOpen(true)}
              />
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ApprovedTokensCard
                approvedTokens={approvedTokens}
                onApprove={() => setIsApproveDialogOpen(true)}
                onDisapprove={() => setIsDisapproveDialogOpen(true)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <DepositDialog
        isLoading={depositLoading}
        isOpen={isDepositDialogOpen}
        tokensInChain={tokensInChain || []}
        whitelistedTokens={[...(contractInfo?.whitelistedTokens || [])]}
        onApproveForVault={handleApproveForVault}
        onClose={() => setIsDepositDialogOpen(false)}
        onDeposit={(tokenAddress, amount) =>
          handleDeposit(tokenAddress, amount)
        }
      />

      <WithdrawDialog
        credit={formattedCredit}
        isLoading={withdrawLoading}
        isOpen={isWithdrawDialogOpen}
        onClose={() => setIsWithdrawDialogOpen(false)}
        onWithdraw={handleWithdraw}
      />

      <ApproveTokenDialog
        approvedTokens={approvedTokens || []}
        isLoading={approveLoading}
        isOpen={isApproveDialogOpen}
        tokensInChain={tokensInChain || []}
        onApprove={handleApproveToken}
        onClose={() => setIsApproveDialogOpen(false)}
      />

      <DisapproveTokenDialog
        approvedTokens={approvedTokens || []}
        isLoading={disapproveLoading}
        isOpen={isDisapproveDialogOpen}
        onClose={() => setIsDisapproveDialogOpen(false)}
        onDisapprove={handleDisapproveToken}
      />

      <TransactionCompleteDialog
        isOpen={isTransactionCompleteDialogOpen}
        result={transactionResult}
        onClose={() => setIsTransactionCompleteDialogOpen(false)}
      />

      <InfoDrawer
        isOpen={isInfoDrawerOpen}
        onClose={() => setIsInfoDrawerOpen(false)}
      />

      <FirstTimeGuide
        isOpen={isFirstTimeGuideOpen}
        onClose={() => setIsFirstTimeGuideOpen(false)}
      />
    </DefaultLayout>
  );
}
