import { useState, useMemo, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Input
} from "@heroui/react";
import { Address } from "viem";
import { normalizeTokenLogoURI } from "@/utils/token";

interface Token {
  address: string;
  chainId: string;
  coingeckoId: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

interface ApproveTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (tokenAddress: Address) => Promise<void>;
  isLoading: boolean;
  tokensInChain: Token[];
  approvedTokens: Token[];
}

export default function ApproveTokenDialog({
  isOpen,
  onClose,
  onApprove,
  isLoading,
  tokensInChain,
  approvedTokens,
}: ApproveTokenDialogProps) {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Focus the search input when modal opens
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Sort tokens: approved tokens first, then unapproved, with search filtering
  const sortedTokens = useMemo(() => {
    const approvedAddresses = new Set(approvedTokens.map(t => t.address));

    // Filter tokens based on search query
    const filteredTokens = tokensInChain.filter(token => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
      );
    });

    const approved = filteredTokens.filter(token => approvedAddresses.has(token.address));
    const unapproved = filteredTokens.filter(token => !approvedAddresses.has(token.address));
    return [...approved, ...unapproved];
  }, [tokensInChain, approvedTokens, searchQuery]);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
  };

  const handleSubmit = async () => {
    if (!selectedToken) return;

    try {
      await onApprove(selectedToken.address as Address);
      setSelectedToken(null);
      onClose();
    } catch (error) {
      console.error("Token approval failed:", error);
    }
  };

  const title = 'Approve Token';
  const buttonText = 'Approve';
  const buttonColor = 'success';

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="p-4"
      disableAnimation={true}
      aria-labelledby="approve-token-modal-title"
      aria-describedby="approve-token-modal-description"
    >
      <ModalContent>
        <ModalHeader>
          <h3 id="approve-token-modal-title" className="text-xl font-bold">{title}</h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div id="approve-token-modal-description" className="text-sm text-gray-400 mb-4">
            💡 Approve tokens to enable gasless transactions through the meta-transaction gateway.
          </div>

          {/* Search Input */}
          <Input
            ref={searchInputRef}
            placeholder="Search tokens by name, symbol, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
            startContent={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          {/* Token List */}
          <div className="h-96 overflow-y-auto space-y-2 pr-2">
            {sortedTokens.map((token) => {
              const isApproved = approvedTokens.some(t => t.address === token.address);
              const isSelected = selectedToken?.address === token.address;

              return (
                <div
                  key={token.address}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
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
                      {isApproved && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                          Approved
                        </span>
                      )}
                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedToken && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium">Selected Token:</div>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={normalizeTokenLogoURI(selectedToken.logoURI)}
                  alt={selectedToken.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-sm">{selectedToken.name} ({selectedToken.symbol})</span>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color={buttonColor as any}
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={!selectedToken}
          >
            {isLoading ? `${buttonText}ing...` : buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}