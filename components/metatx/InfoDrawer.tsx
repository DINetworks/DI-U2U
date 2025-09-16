import { AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerContent,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface InfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoDrawer({ isOpen, onClose }: InfoDrawerProps) {
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
              <h3 className="text-xl font-bold">Gasless Meta-Transactions Guide</h3>
              <p className="text-sm text-gray-500 mt-1">
                Learn how gasless transactions work and explore all features
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* What are Gasless Transactions */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    🚀 What are Gasless Transactions?
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Gasless transactions allow you to execute blockchain operations without paying gas fees in the native token of the chain. Instead, you pay in U2U tokens, which are converted to cover your gas costs across all supported chains.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Benefits:</strong> No need to hold native tokens, unified payment system, cross-chain compatibility
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* How it Works */}
              <Card className="bg-green-50 dark:bg-green-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    ⚙️ How It Works
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h5 className="font-medium">Deposit U2U Tokens</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Deposit U2U tokens into your gas credit vault to build up credits for gasless transactions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium">Approve Tokens</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Approve tokens you want to transfer gaslessly through the meta-transaction gateway.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h5 className="font-medium">Execute Gasless Transfers</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Create batch transfers that execute without paying gas fees in native tokens.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Component Guide */}
              <Card className="bg-purple-50 dark:bg-purple-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    🧩 Component Guide
                  </h4>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Gasless Batch Transfer</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Main component for creating multiple token transfers. Add/remove transfer rows, select tokens, enter amounts and recipient addresses.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Gas Credit Card</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Shows your current U2U credit balance. Use deposit/withdraw buttons to manage your gas credits.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Approved Tokens Card</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Lists all tokens you've approved for gasless transfers. Add new approvals or remove existing ones.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 dark:text-purple-300">Contracts Info</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Displays important contract addresses and network information for transparency.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Tips */}
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    💡 Pro Tips
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Maintain sufficient U2U balance for gas credits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Batch multiple transfers to save on overall gas costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Check gas estimates before confirming transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>Approved tokens remain approved until manually disapproved</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <Button color="primary" onPress={onClose} className="w-full">
                Got it!
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AnimatePresence>
  );
}