import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";

interface BridgeFirstTimeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BridgeFirstTimeGuide({
  isOpen,
  onClose,
}: BridgeFirstTimeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: "Welcome to IU2U Bridge! 🌉",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Welcome to the IU2U Cross-Chain Bridge! This powerful tool allows
            you to seamlessly transfer IU2U tokens across multiple blockchain
            networks.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              What you can do:
            </h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Deposit native U2U tokens to get IU2U tokens</li>
              <li>• Withdraw IU2U tokens back to native U2U</li>
              <li>• Transfer IU2U tokens across different blockchains</li>
              <li>• Execute smart contract functions across chains</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Understanding Bridge Operations",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            IU2U Bridge supports multiple types of operations. Let&apos;s
            explore each one:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-green-800 dark:text-green-200">
                  Token Operations
                </h5>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Deposit native U2U to get IU2U tokens, or withdraw IU2U back
                  to native U2U on the U2U Nebulas Testnet.
                </p>
              </CardBody>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200">
                  Cross-Chain Transfers
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Send IU2U tokens from one blockchain to another using the IU2U
                  Gateway protocol.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "How to Use Token Operations",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Deposit U2U → IU2U:
            </h4>
            <ol className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <li>
                1. Select &quot;Deposit U2U → IU2U&quot; from the operation
                dropdown
              </li>
              <li>2. The chain is automatically set to U2U Nebulas Testnet</li>
              <li>
                3. Enter the amount of native U2U tokens you want to deposit
              </li>
              <li>
                4. Click &quot;Deposit U2U → IU2U&quot; to complete the
                transaction
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Withdraw IU2U → U2U:
            </h4>
            <ol className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>
                1. Select &quot;Withdraw IU2U → U2U&quot; from the operation
                dropdown
              </li>
              <li>2. The chain is automatically set to U2U Nebulas Testnet</li>
              <li>3. Enter the amount of IU2U tokens you want to withdraw</li>
              <li>
                4. Click &quot;Withdraw IU2U → U2U&quot; to complete the
                transaction
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Cross-Chain Transfers",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Cross-chain transfers allow you to send IU2U tokens between
            different blockchain networks:
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
              How to transfer:
            </h4>
            <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
              <li>• Switch to the &quot;Cross-Chain Transfer&quot; tab</li>
              <li>• Select source chain (where your IU2U tokens are)</li>
              <li>
                • Select destination chain (where you want to send tokens)
              </li>
              <li>• Enter recipient address on the destination chain</li>
              <li>• Enter amount of IU2U tokens to transfer</li>
              <li>
                • Click &quot;Send IU2U Cross-Chain&quot; to initiate transfer
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>Note:</strong> Cross-chain transfers may take several
              minutes to complete depending on network congestion.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Contract Calls & Advanced Features",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            For advanced users, IU2U Bridge supports executing smart contract
            functions across chains:
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
              Contract Call Features:
            </h4>
            <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
              <li>• Execute smart contract functions on destination chains</li>
              <li>
                • Optionally send IU2U tokens along with the contract call
              </li>
              <li>• Perfect for cross-chain DeFi operations</li>
              <li>• Supports complex multi-step transactions</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-red-50 dark:bg-red-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-red-800 dark:text-red-200">
                  Security First
                </h5>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Always verify contract addresses</li>
                  <li>• Double-check recipient addresses</li>
                  <li>• Keep sufficient gas for destination chain</li>
                  <li>• Save transaction hashes for reference</li>
                </ul>
              </CardBody>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-green-800 dark:text-green-200">
                  Best Practices
                </h5>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Start with small test amounts</li>
                  <li>• Monitor transaction progress</li>
                  <li>• Keep multiple confirmations</li>
                  <li>• Use reputable wallet software</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "IU2U Bridge: Foundation for Cross-Chain DeFi",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            IU2U Bridge is more than just a token bridge—it&apos;s the
            infrastructure foundation for next-generation cross-chain DeFi
            protocols:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cross-Chain Swaps */}
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200">
                  🔄 Cross-Chain Swaps
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Swap tokens across chains without intermediaries. Find best
                  prices across all supported networks in one seamless
                  transaction.
                </p>
              </CardBody>
            </Card>

            {/* Cross-Chain Lending */}
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-green-800 dark:text-green-200">
                  💰 Cross-Chain Lending
                </h5>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Borrow on low-interest chains using collateral from
                  high-liquidity networks. Maximize your DeFi strategy across
                  chains.
                </p>
              </CardBody>
            </Card>

            {/* Liquidity Provision */}
            <Card className="bg-purple-50 dark:bg-purple-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-purple-800 dark:text-purple-200">
                  🏊 Liquidity Mining
                </h5>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Provide liquidity to AMMs across multiple chains
                  simultaneously. Earn trading fees from global liquidity pools.
                </p>
              </CardBody>
            </Card>

            {/* Staking & Yield */}
            <Card className="bg-yellow-50 dark:bg-yellow-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  🌾 Yield Optimization
                </h5>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Stake assets on high-yield chains while maintaining positions
                  across networks for optimal returns and risk management.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
              🎯 Advanced Protocol Integrations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <h5 className="font-medium text-indigo-700 dark:text-indigo-300">
                  DEX Aggregators
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find optimal prices across all supported chains and execute
                  trades in a single cross-chain transaction.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-indigo-700 dark:text-indigo-300">
                  Cross-Chain Insurance
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Protect your multi-chain positions with coverage that spans
                  across different blockchain networks.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-indigo-700 dark:text-indigo-300">
                  DAO Governance
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Participate in governance across multiple chains. Vote on
                  proposals and manage cross-chain treasuries.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-indigo-700 dark:text-indigo-300">
                  NFT Marketplaces
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transfer NFTs between chains for arbitrage opportunities and
                  access to global NFT marketplaces.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              🚀 Future Possibilities
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              IU2U Bridge&apos;s architecture enables unprecedented cross-chain
              DeFi innovations, from automated yield optimization to cross-chain
              synthetic assets and decentralized derivatives markets.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Getting Started - Your First Bridge Transaction",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Ready to start?
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Here&apos;s a quick checklist to get you started with your first
              bridge transaction:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Connect your wallet to the IU2U Bridge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Ensure you have sufficient tokens for the operation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Double-check all addresses and amounts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Confirm the transaction in your wallet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Wait for the transaction to complete</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Need Help?</strong> Use the info button (ℹ️) anytime to
              access detailed information about bridge operations and features.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishGuide = () => {
    if (dontShowAgain) {
      localStorage.setItem("bridge-guide-seen", "true");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          backdrop="blur"
          className="p-4"
          isOpen={isOpen}
          size="2xl"
          onClose={finishGuide}
        >
          <ModalContent>
            <ModalHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🌉</span>
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Step {currentStep + 1} of 7
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody>
              <motion.div
                key={currentStep}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>

              {/* Progress Indicator */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {Array.from({ length: 7 }, (_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentStep
                          ? "bg-blue-500"
                          : index < currentStep
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex-col gap-4">
              {currentStep === steps.length - 1 && (
                <div className="flex items-center justify-center w-full">
                  <Checkbox
                    isSelected={dontShowAgain}
                    size="sm"
                    onValueChange={setDontShowAgain}
                  >
                    Don&apos;t show this guide again
                  </Checkbox>
                </div>
              )}

              <div className="flex justify-between w-full">
                <Button
                  disabled={currentStep === 0}
                  variant="flat"
                  onPress={prevStep}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentStep === steps.length - 1 ? (
                    <Button color="success" onPress={finishGuide}>
                      Get Started!
                    </Button>
                  ) : (
                    <Button color="primary" onPress={nextStep}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
}
