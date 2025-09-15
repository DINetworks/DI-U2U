import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image
} from "@heroui/react";
import { normalizeTokenLogoURI } from "@/utils/token";
import { Address } from "viem";

interface Token {
  address: string;
  chainId: string;
  coingeckoId: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

interface DisapproveTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDisapprove: (tokenAddress: Address) => Promise<void>;
  isLoading: boolean;
  approvedTokens: Token[];
}

export default function DisapproveTokenDialog({
  isOpen,
  onClose,
  onDisapprove,
  isLoading,
  approvedTokens,
}: DisapproveTokenDialogProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
  };

  const handleSubmit = async () => {
    if (!selectedToken) return;

    try {
      await onDisapprove(selectedToken.address as Address);
      setSelectedToken(null);
      onClose();
    } catch (error) {
      console.error("Disapprove failed:", error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="lg" className="p-4">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Disapprove Token</h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            💡 Remove token approval to revoke gateway access for gasless transactions.
          </div>

          {/* Approved Tokens List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {approvedTokens.length > 0 ? (
              approvedTokens.map((token) => {
                const isSelected = selectedToken?.address === token.address;

                return (
                  <div
                    key={token.address}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
                    }`}
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative flex-shrink-0">
                          <Image
                            src={normalizeTokenLogoURI(token.logoURI)}
                            alt={token.symbol}
                            className="rounded-full object-cover"
                            fallbackSrc='/images/token-placeholder.png'
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{token.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {token.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                          Approved
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <div className="font-medium">No Approved Tokens</div>
                <div className="text-sm">You don't have any approved tokens to disapprove.</div>
              </div>
            )}
          </div>

          {selectedToken && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm font-medium">Selected Token to Disapprove:</div>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-sm">{selectedToken.name} ({selectedToken.symbol})</span>
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                ⚠️ This will revoke gateway access for gasless transactions with this token.
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={!selectedToken || approvedTokens.length === 0}
          >
            {isLoading ? "Disapproving..." : "Disapprove"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}