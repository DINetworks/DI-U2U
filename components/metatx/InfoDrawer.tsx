import { AnimatePresence } from "framer-motion";
import {
  Drawer,
  DrawerContent,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { APP_CONTENT } from "@/constants/content";

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
              <h3 className="text-xl font-bold">{APP_CONTENT.infoDrawer.header.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {APP_CONTENT.infoDrawer.header.subtitle}
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* What are Gasless Transactions */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    🚀 {APP_CONTENT.infoDrawer.sections.whatAreGasless.title}
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {APP_CONTENT.infoDrawer.sections.whatAreGasless.content}
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Benefits:</strong> {APP_CONTENT.infoDrawer.sections.whatAreGasless.benefits}
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* How it Works */}
              <Card className="bg-green-50 dark:bg-green-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    ⚙️ {APP_CONTENT.infoDrawer.sections.howItWorks.title}
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="space-y-4">
                    {APP_CONTENT.infoDrawer.sections.howItWorks.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h5 className="font-medium">{step.title}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {step.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Component Guide */}
              <Card className="bg-purple-50 dark:bg-purple-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    🧩 {APP_CONTENT.infoDrawer.sections.componentGuide.title}
                  </h4>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="space-y-3">
                    {APP_CONTENT.infoDrawer.sections.componentGuide.components.map((component, index) => (
                      <div key={index}>
                        <h5 className="font-medium text-purple-700 dark:text-purple-300">{component.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {component.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Tips */}
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 overflow-visible">
                <CardHeader>
                  <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    💡 {APP_CONTENT.infoDrawer.sections.proTips.title}
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {APP_CONTENT.infoDrawer.sections.proTips.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <Button color="primary" onPress={onClose} className="w-full">
                {APP_CONTENT.infoDrawer.footer.buttonText}
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </AnimatePresence>
  );
}