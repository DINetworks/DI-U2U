import { AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerContent,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface BridgeInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BridgeInfoDrawer({ isOpen, onClose }: BridgeInfoDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          placement="right"
          size="md"
          backdrop="transparent"
        >
          <DrawerContent className="h-full flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold">IU2U Bridge Information</h3>
              <p className="text-sm text-gray-500 mt-1">
                Learn about cross-chain token transfers and bridge operations
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* What is IU2U Bridge */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    🌉 What is IU2U Bridge?
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    IU2U Bridge is a powerful cross-chain infrastructure that enables seamless token transfers and complex DeFi operations across multiple EVM-compatible blockchains. Built on the revolutionary IU2U protocol, it serves as the foundation for next-generation cross-chain DeFi applications.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Supported Networks:</strong> U2U Nebulas Testnet, Polygon, Arbitrum, BSC, Ethereum, Optimism, Base
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>🚀 Foundation for Cross-Chain DeFi:</strong> Powers cross-chain swaps, lending, staking, liquidity provision, and advanced DeFi protocols
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Bridge Operations */}
              <Card className="bg-green-50 dark:bg-green-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    🔄 Bridge Operations
                  </h4>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h5 className="font-medium">Token Operations (Deposit/Withdraw)</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Convert between native U2U tokens and IU2U tokens on U2U Nebulas Testnet
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium">Cross-Chain Transfers</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Send IU2U tokens from one blockchain to another using the IU2U Gateway
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h5 className="font-medium">Contract Calls</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Execute smart contract functions on destination chains with optional IU2U token transfers
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Bridge Components */}
              <Card className="bg-purple-50 dark:bg-purple-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    🧩 Bridge Components
                  </h4>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Operation Type Selector</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose between Deposit, Withdraw, Cross-Chain Transfer, or Contract Call operations
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Chain Selector</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Select source and destination blockchains for cross-chain operations
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Amount Input</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Specify the amount of tokens to transfer with balance validation
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Address Input</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter recipient addresses or contract addresses for operations
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Advanced Use Cases */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    🚀 Advanced Use Cases & Cross-Chain DeFi
                  </h4>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cross-Chain Swaps */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔄 Cross-Chain Swaps</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Swap tokens across different chains without intermediaries. Trade ETH on Ethereum for MATIC on Polygon seamlessly.
                      </p>
                    </div>

                    {/* Cross-Chain Lending */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">💰 Cross-Chain Lending</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Borrow assets on one chain while using collateral from another. Access liquidity across the entire DeFi ecosystem.
                      </p>
                    </div>

                    {/* Liquidity Provision */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🏊 Liquidity Provision</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Provide liquidity to AMMs across multiple chains. Earn fees from cross-chain trading pairs simultaneously.
                      </p>
                    </div>

                    {/* Staking & Yield Farming */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🌾 Staking & Yield Farming</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Stake tokens on high-yield chains while maintaining positions across multiple networks for optimal returns.
                      </p>
                    </div>

                    {/* Cross-Chain NFTs */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🎨 Cross-Chain NFTs</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Transfer NFTs between chains for marketplace arbitrage, gaming, and multi-chain collections.
                      </p>
                    </div>

                    {/* DAO Governance */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🏛️ DAO Governance</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Participate in governance across multiple chains. Vote on proposals and manage treasury across networks.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">🎯 Protocol Integration Examples</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong className="text-green-700 dark:text-green-300">DEX Aggregators:</strong>
                        <p className="text-gray-600 dark:text-gray-400">Find best prices across all chains in one transaction</p>
                      </div>
                      <div>
                        <strong className="text-green-700 dark:text-green-300">Lending Protocols:</strong>
                        <p className="text-gray-600 dark:text-gray-400">Borrow on low-interest chains, lend on high-yield chains</p>
                      </div>
                      <div>
                        <strong className="text-green-700 dark:text-green-300">Insurance:</strong>
                        <p className="text-gray-600 dark:text-gray-400">Cross-chain coverage for multi-network positions</p>
                      </div>
                      <div>
                        <strong className="text-green-700 dark:text-green-300">Prediction Markets:</strong>
                        <p className="text-gray-600 dark:text-gray-400">Bet across chains with global liquidity pools</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Bridge Tips */}
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    💡 Bridge Tips
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Deposit/Withdraw operations are only available on U2U Nebulas Testnet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Always verify recipient addresses before cross-chain transfers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Cross-chain transfers may take several minutes to complete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Keep sufficient native tokens for gas fees on destination chains</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Use contract calls for advanced DeFi operations across chains</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>

              {/* Security Notes */}
              <Card className="bg-red-50 dark:bg-red-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    🔒 Security Notes
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Double-check all addresses before confirming transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Only interact with verified contracts and addresses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Be aware of network congestion and gas fee fluctuations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Keep backup of important transaction hashes for reference</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <Button color="primary" onPress={onClose} className="w-full">
                Got it, thanks!
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AnimatePresence>
  );
}