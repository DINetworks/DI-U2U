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
import { Tooltip } from "@heroui/tooltip";
import { Image } from "@heroui/image";
import {
  useConnect,
  useDisconnect,
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { useState, useEffect } from "react";
import { formatEther } from "viem";

import { config } from "@/config/web3";
import { shortenAddress } from "@/utils/token";
import { useWalletModal } from "@/contexts/WalletContext";
import { getChainLogo } from "@/config/chains";

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
  const currentChain = config.chains.find((chain) => chain.id === chainId);

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
      <div className="flex items-center gap-4">
        {/* Chain Icon */}
        <Tooltip content="Switch Network" placement="bottom">
          <div
            className="cursor-pointer hover:scale-110 transition-transform select-none"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setIsChainModalOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setIsChainModalOpen(true);
              }
            }}
          >
            <Image
              alt={`${currentChain?.name || "Chain"} logo`}
              className="rounded-full"
              height={24}
              src={getChainLogo(chainId)}
              width={24}
            />
          </div>
        </Tooltip>

        {/* Address Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="min-w-0 h-10 px-3 text-success font-medium"
              color="success"
              endContent={
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="#17C964"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              }
              variant="bordered"
            >
              {shortenAddress(address)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Wallet options">
            <DropdownItem key="address" showDivider className="h-auto py-3">
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs text-gray-400">Address</span>
                <div className="flex items-start justify-between w-full">
                  <span className="font-mono text-sm break-all leading-tight max-w-60">
                    {address}
                  </span>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <Button
                      isIconOnly
                      className="w-6 h-6"
                      size="sm"
                      variant="light"
                      onPress={handleCopyAddress}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </Button>
                    <Button
                      isIconOnly
                      as="a"
                      className="w-6 h-6"
                      href={getBlockExplorerUrl(address)}
                      rel="noopener noreferrer"
                      size="sm"
                      target="_blank"
                      variant="light"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem key="chain" showDivider className="h-auto py-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Image
                    alt={`${currentChain?.name || "Chain"} logo`}
                    className="rounded-full"
                    height={20}
                    src={getChainLogo(chainId)}
                    width={20}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Network</span>
                    <span className="font-medium text-sm">
                      {currentChain?.name || "Unknown"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Balance</div>
                  <div className="font-medium text-sm">
                    {balance
                      ? parseFloat(formatEther(balance.value)).toFixed(4)
                      : "0"}{" "}
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18.364 5.636l-12.728 12.728m0 0L5 5m5.636 12.728L19 19"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
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
          size="md"
          onClose={() => setIsChainModalOpen(false)}
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
                        ? "bg-primary/20 border-primary"
                        : "hover:bg-primary/10 hover:border-primary hover:scale-[1.02] hover:shadow-lg"
                    }`}
                    disabled={chain.id === chainId}
                    variant={chain.id === chainId ? "flat" : "bordered"}
                    onPress={() => handleChainSwitch(chain.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        alt={`${chain.name} logo`}
                        className="rounded-full"
                        height={24}
                        src={getChainLogo(chain.id)}
                        width={24}
                      />
                      <div className="text-left">
                        <div className="font-medium">{chain.name}</div>
                        <div className="text-xs text-gray-400">
                          {chain.nativeCurrency?.symbol}
                        </div>
                      </div>
                      {chain.id === chainId && (
                        <div className="ml-auto flex items-center gap-1 text-green-500">
                          <svg
                            className="w-4 h-4"
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
                          <span>Connected</span>
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

      <Modal backdrop="blur" className="p-4" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalBody className="pb-6">
            <div className="space-y-3">
              {connectors.map((connector) => {
                const getWalletIcon = (name: string) => {
                  if (name.toLowerCase().includes("metamask")) {
                    return (
                      <Image
                        alt={`metamask`}
                        className="rounded-full"
                        height={32}
                        src={"/images/icons/wallet/metamask.png"}
                        width={32}
                      />
                    );
                  }
                  if (name.toLowerCase().includes("walletconnect")) {
                    return (
                      <Image
                        alt={`metamask`}
                        className="rounded-full"
                        height={32}
                        src={"/images/icons/wallet/walletconnect.png"}
                        width={32}
                      />
                    );
                  }
                  if (name.toLowerCase().includes("coinbase")) {
                    return (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path
                          d="M12 6v12M6 12h12"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                    );
                  }

                  return (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  );
                };

                return (
                  <Button
                    key={connector.id}
                    className="w-full justify-start h-14 transition-all duration-200 hover:bg-success/10 hover:border-success hover:scale-[1.02] hover:shadow-lg"
                    variant="bordered"
                    onPress={() => handleConnect(connector)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 py-2">
                        {getWalletIcon(connector.name)}
                      </div>
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
