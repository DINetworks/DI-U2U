import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@heroui/react";

import { normalizeTokenLogoURI } from "@/utils/token";
import { useCredit } from "@/hooks/useCredit";
import { TransactionCompleteDialogProps } from "@/types/component";

export default function TransactionCompleteDialog({
  isOpen,
  onClose,
  result,
}: TransactionCompleteDialogProps) {
  const { formattedCredit } = useCredit();

  if (!result) return null;

  const { type, token, amount, creditBefore, creditAdded } = result;

  return (
    <Modal
      backdrop="blur"
      className="p-4"
      isOpen={isOpen}
      size="md"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-600">
              Transaction Complete!
            </h3>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Transaction Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Transaction Type
              </span>
              <span className="text-sm font-semibold capitalize">{type}</span>
            </div>

            {token && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Token
                </span>
                <div className="flex items-center gap-2">
                  <Image
                    alt={token.symbol}
                    className="rounded-full"
                    height={20}
                    src={normalizeTokenLogoURI(token.logoURI)}
                    width={20}
                  />
                  <span className="text-sm font-semibold">
                    {token.name} ({token.symbol})
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {type === "deposit" ? "Amount Deposited" : "Amount Withdrawn"}
              </span>
              <span className="text-sm font-semibold">
                {amount} {token ? token.symbol : "U2U"}
              </span>
            </div>
          </div>

          {/* Credit Changes */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Credit Balance Changes
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Before
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {creditBefore}
                </div>
                <div className="text-xs text-gray-500">Credits</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  After
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formattedCredit}
                </div>
                <div className="text-xs text-gray-500">Credits</div>
              </div>
            </div>

            <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {type === "deposit" ? "Credits Added" : "Credits Withdrawn"}
                </span>
                <span
                  className={`text-sm font-bold ${type === "deposit" ? "text-green-600" : "text-red-600"}`}
                >
                  {type === "deposit" ? "+" : "-"}
                  {creditAdded}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            🎉 Your gasless transaction credits have been{" "}
            {type === "deposit" ? "increased" : "decreased"} successfully!
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full" color="primary" onPress={onClose}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
