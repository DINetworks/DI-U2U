import { useState, useEffect } from "react";
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

interface FirstTimeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FirstTimeGuide({ isOpen, onClose }: FirstTimeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: "Welcome to Gasless Meta-Transactions! 🎉",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This platform allows you to execute blockchain transactions without paying gas fees in native tokens.
            Instead, you pay in U2U tokens across all supported chains.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Benefits:</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• No need to hold native tokens for each chain</li>
              <li>• Unified payment system across all chains</li>
              <li>• Batch multiple transfers to save costs</li>
              <li>• Real-time gas cost estimation</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Step 1: Build Your Gas Credit 💰",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            First, you need to deposit U2U tokens to build up your gas credit balance. This credit will be used to pay for your gasless transactions.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">How to deposit:</h4>
            <ol className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <li>1. Click the "Deposit" button in the Gas Credit Card</li>
              <li>2. Select a U2U token from the dropdown</li>
              <li>3. Enter the amount you want to deposit</li>
              <li>4. Approve the transaction and confirm</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Approve Tokens for Transfer ✅",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Before you can transfer tokens gaslessly, you need to approve them for the meta-transaction gateway. This allows the system to execute transfers on your behalf.
          </p>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Token Approval:</h4>
            <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
              <li>• Click "Approve Token" in the Approved Tokens Card</li>
              <li>• Search and select the token you want to approve</li>
              <li>• Confirm the approval transaction</li>
              <li>• Once approved, the token appears in your approved list</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Create Gasless Transfers 🚀",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Now you're ready to create gasless batch transfers! You can send multiple tokens to different addresses in a single transaction.
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Creating Transfers:</h4>
            <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
              <li>• Select approved tokens from the dropdown</li>
              <li>• Enter recipient addresses (must be valid)</li>
              <li>• Specify transfer amounts</li>
              <li>• Add multiple transfer rows as needed</li>
              <li>• Review costs and confirm the transaction</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Pro Tips & Best Practices 💡",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-yellow-50 dark:bg-yellow-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">Cost Optimization</h5>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Batch multiple transfers together</li>
                  <li>• Check gas estimates before confirming</li>
                  <li>• Monitor your credit balance</li>
                </ul>
              </CardBody>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/20">
              <CardBody className="space-y-2">
                <h5 className="font-semibold text-red-800 dark:text-red-200">Security Notes</h5>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li>• Double-check recipient addresses</li>
                  <li>• Verify token approvals</li>
                  <li>• Keep sufficient U2U balance</li>
                </ul>
              </CardBody>
            </Card>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Need Help?</strong> Click the info icon next to the page title anytime to access the full guide and documentation.
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
      localStorage.setItem('metatx-guide-seen', 'true');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={finishGuide}
          size="2xl"
          backdrop="blur"
          className="p-4"
        >
          <ModalContent>
            <ModalHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">?</span>
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">{steps[currentStep].title}</h3>
                  <p className="text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>

              {/* Progress Indicator */}
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentStep
                          ? 'bg-blue-500'
                          : index < currentStep
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
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
                    onValueChange={setDontShowAgain}
                    size="sm"
                  >
                    Don't show this guide again
                  </Checkbox>
                </div>
              )}

              <div className="flex justify-between w-full">
                <Button
                  variant="flat"
                  onPress={prevStep}
                  disabled={currentStep === 0}
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