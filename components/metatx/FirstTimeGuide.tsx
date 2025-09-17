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
import { APP_CONTENT } from "@/constants/content";

interface FirstTimeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FirstTimeGuide({ isOpen, onClose }: FirstTimeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = APP_CONTENT.firstTimeGuide.steps.map((stepData, index) => {
    if (index === 0) {
      // Welcome step
      return {
        title: stepData.title,
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {stepData.content}
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Benefits:</h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                {stepData.benefits?.map((benefit, idx) => (
                  <li key={idx}>• {benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ),
      };
    } else if (index === 4) {
      // Pro tips step
      return {
        title: stepData.title,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-yellow-50 dark:bg-yellow-900/20">
                <CardBody className="space-y-2">
                  <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">Cost Optimization</h5>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {stepData.costOptimization?.map((tip, idx) => (
                      <li key={idx}>• {tip}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card className="bg-red-50 dark:bg-red-900/20">
                <CardBody className="space-y-2">
                  <h5 className="font-semibold text-red-800 dark:text-red-200">Security Notes</h5>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    {stepData.securityNotes?.map((note, idx) => (
                      <li key={idx}>• {note}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Need Help?</strong> {stepData.content}
              </p>
            </div>
          </div>
        ),
      };
    } else {
      // Regular steps
      return {
        title: stepData.title,
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {stepData.content}
            </p>
            <div className={`bg-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-50 dark:bg-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-900/20 p-4 rounded-lg`}>
              <h4 className={`font-semibold text-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-800 dark:text-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-200 mb-2`}>
                {index === 1 ? 'How to deposit:' : index === 2 ? 'Token Approval:' : 'Creating Transfers:'}
              </h4>
              {index === 1 ? (
                <ol className={`space-y-1 text-sm text-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-700 dark:text-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-300`}>
                  {stepData.instructions?.map((instruction, idx) => (
                    <li key={idx}>{idx + 1}. {instruction}</li>
                  ))}
                </ol>
              ) : (
                <ul className={`space-y-1 text-sm text-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-700 dark:text-${index === 1 ? 'green' : index === 2 ? 'purple' : 'orange'}-300`}>
                  {stepData.instructions?.map((instruction, idx) => (
                    <li key={idx}>• {instruction}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ),
      };
    }
  });

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
                    {APP_CONTENT.firstTimeGuide.navigation.skip}
                  </Checkbox>
                </div>
              )}

              <div className="flex justify-between w-full">
                <Button
                  variant="flat"
                  onPress={prevStep}
                  disabled={currentStep === 0}
                >
                  {APP_CONTENT.firstTimeGuide.navigation.previous}
                </Button>

                <div className="flex gap-2">
                  {currentStep === steps.length - 1 ? (
                    <Button color="success" onPress={finishGuide}>
                      {APP_CONTENT.firstTimeGuide.navigation.finish}
                    </Button>
                  ) : (
                    <Button color="primary" onPress={nextStep}>
                      {APP_CONTENT.firstTimeGuide.navigation.next}
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