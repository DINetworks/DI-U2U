import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

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
import { useTokensWithAllowances } from "@/hooks/useTokensWithAllowances";
import { CONTRACT_ADDRESSES } from "@/config/web3";

const GATEWAY = CONTRACT_ADDRESSES.METATX_GATEWAY as `0x${string}`

export default function MetaTxPage() {
  const router = useRouter();
  const { vaultContract, gatewayContract, contractInfo, isLoading, error } = useGaslessContracts();
  const { formattedCredit, refetch: refetchCredit } = useCredit();
  const { approvedTokens, refetchAllowances, tokensInChain } =
    useTokensWithAllowances(GATEWAY)

    console.log('tokensInChain', tokensInChain)

  const [transfers, setTransfers] = useState([{ id: 1, token: "", receiver: "", amount: "" }]);
  const [nextId, setNextId] = useState(2);

  // Dialog states
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isDisapproveDialogOpen, setIsDisapproveDialogOpen] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [disapproveLoading, setDisapproveLoading] = useState(false);

  // No need for manual credit fetching - useCredit hook handles it

  const addTransfer = () => {
    setTransfers([...transfers, { id: nextId, token: "", receiver: "", amount: "" }]);
    setNextId(nextId + 1);
  };

  const removeTransfer = (id: number) => {
    if (transfers.length > 1) {
      setTransfers(transfers.filter(t => t.id !== id));
    }
  };

  const updateTransfer = (id: number, field: string, value: string) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const navigateToPage = (link: string) => {
    router.push(link);
  };


  const handleStartTransaction = () => {
    navigateToPage("/swap");
  };

  const handleDeposit = async (tokenAddress: `0x${string}`, amount: bigint) => {
    if (!vaultContract) return;

    try {
      setDepositLoading(true);
      await vaultContract.deposit(tokenAddress, amount);
      // Refresh credit balance
      refetchCredit();
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
      await vaultContract.withdraw(creditAmount);
      // Refresh credit balance
      refetchCredit();
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
      // Approve token for the gateway contract
      await vaultContract.approveForGateway(tokenAddress, BigInt(2**256 - 1)); // Max approval
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
          <h1 className={title({ size: "lg", class: "gradient-metal" })}>
            Gasless Meta-Transactions
          </h1>
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
                  transfers={transfers}
                  credit={formattedCredit}
                  onAddTransfer={addTransfer}
                  onRemoveTransfer={removeTransfer}
                  onUpdateTransfer={updateTransfer}
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
        isOpen={isDepositDialogOpen}
        onClose={() => setIsDepositDialogOpen(false)}
        onDeposit={handleDeposit}
        isLoading={depositLoading}
      />

      <WithdrawDialog
        isOpen={isWithdrawDialogOpen}
        onClose={() => setIsWithdrawDialogOpen(false)}
        onWithdraw={handleWithdraw}
        isLoading={withdrawLoading}
        credit={formattedCredit}
      />

      <ApproveTokenDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onApprove={handleApproveToken}
        isLoading={approveLoading}
        tokensInChain={tokensInChain || []}
        approvedTokens={approvedTokens || []}
      />

      <DisapproveTokenDialog
        isOpen={isDisapproveDialogOpen}
        onClose={() => setIsDisapproveDialogOpen(false)}
        onDisapprove={handleDisapproveToken}
        isLoading={disapproveLoading}
        approvedTokens={approvedTokens || []}
      />

    </DefaultLayout>
  );
}