import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useConnect, useDisconnect, useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { config } from "@/config/web3";

import { shortenAddress } from "@/utils/token";
import { useWalletModal } from "@/contexts/WalletContext";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);

  const { setOpenConnectModal } = useWalletModal();

  useEffect(() => {
    setOpenConnectModal(() => onOpen);
  }, [onOpen, setOpenConnectModal]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current chain info
  const currentChain = config.chains.find(chain => chain.id === chainId);

  // Chain icons mapping
  const getChainIcon = (chainId: number) => {
    switch (chainId) {
      case 1: return "🔷"; // Ethereum
      case 56: return "🟡"; // BSC
      case 137: return "🟣"; // Polygon
      case 10: return "🔴"; // Optimism
      case 42161: return "🔵"; // Arbitrum
      case 43114: return "🔺"; // Avalanche
      case 8453: return "🔵"; // Base
      default: return "⛓️";
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const getBlockExplorerUrl = (address: string) => {
    if (!currentChain?.blockExplorers?.default) return "#";
    return `${currentChain.blockExplorers.default.url}/address/${address}`;
  };

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      await switchChainAsync({ chainId: targetChainId });
      setIsChainModalOpen(false);
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  if (!isClient) return null;

  const handleConnect = (connector: any) => {
    connect({ connector });
    onClose();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Chain Icon */}
        <div
          className="text-lg cursor-pointer hover:scale-110 transition-transform select-none"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Chain icon clicked, opening modal");
            console.log("Current modal state:", isChainModalOpen);
            setIsChainModalOpen(true);
            console.log("Setting modal to true");
          }}
          title="Switch Network"
        >
          {getChainIcon(chainId)}
        </div>

        {/* Address Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="min-w-0 h-8 px-3 text-sm text-success font-medium"
              endContent={
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              }
            >
              {shortenAddress(address)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Wallet options">
            <DropdownItem
              key="address"
              className="h-auto py-3"
              showDivider
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-gray-500">Address</span>
                  <span className="font-mono text-sm break-all leading-tight max-w-60">
                    {address}
                  </span>
                </div>
                <div className="flex gap-2 ml-2 flex-shrink-0">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleCopyAddress}
                    className="w-6 h-6"
                  >
                    📋
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    as="a"
                    href={getBlockExplorerUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6"
                  >
                    🔗
                  </Button>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              key="chain"
              className="h-auto py-3"
              showDivider
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getChainIcon(chainId)}</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Network</span>
                    <span className="font-medium text-sm">{currentChain?.name || "Unknown"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Balance</div>
                  <div className="font-medium text-sm">
                    {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : "0"}{" "}
                    {currentChain?.nativeCurrency?.symbol || "ETH"}
                  </div>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              key="disconnect"
              className="text-warning"
              color="warning"
              onPress={() => disconnect()}
            >
              <div className="flex items-center gap-2 py-2">
                <span>🔌</span>
                <span>Disconnect Wallet</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* Chain Switch Modal */}
      <Modal
        backdrop="blur"
        className="p-4"
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        size="md"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">Switch Network</h3>
          </ModalHeader>
          <ModalBody className="space-y-3">
            <div className="text-sm text-gray-400 mb-4">
              Choose a network to switch to:
            </div>
            <div className="space-y-2">
              {config.chains.map((chain) => (
                <Button
                  key={chain.id}
                  className={`w-full justify-start h-14 transition-all duration-200 ${
                    chain.id === chainId
                      ? 'bg-primary/20 border-primary'
                      : 'hover:bg-primary/10 hover:border-primary hover:scale-[1.02] hover:shadow-lg'
                  }`}
                  variant={chain.id === chainId ? "flat" : "bordered"}
                  onPress={() => handleChainSwitch(chain.id)}
                  disabled={chain.id === chainId}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getChainIcon(chain.id)}
                    </span>
                    <div className="text-left">
                      <div className="font-medium">{chain.name}</div>
                      <div className="text-xs text-gray-400">
                        {chain.nativeCurrency?.symbol}
                      </div>
                    </div>
                    {chain.id === chainId && (
                      <div className="ml-auto text-green-500">
                        ✓ Connected
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      </div>
    );
  }

  return (
    <>
      <Button color="primary" radius="full" onPress={onOpen}>
        Connect Wallet
      </Button>

      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalBody className="pb-6">
            <div className="space-y-3">
              {connectors.map((connector) => {
                const getWalletIcon = (name: string) => {
                  if (name.toLowerCase().includes("metamask")) return "🦊";
                  if (name.toLowerCase().includes("walletconnect")) return "🔗";
                  if (name.toLowerCase().includes("coinbase")) return "🔵";

                  return "💼";
                };

                return (
                  <Button
                    key={connector.id}
                    className="w-full justify-start h-14 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:scale-[1.02] hover:shadow-lg"
                    variant="bordered"
                    onPress={() => handleConnect(connector)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getWalletIcon(connector.name)}
                      </span>
                      <span className="font-medium">{connector.name}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

    </>
  );
}
