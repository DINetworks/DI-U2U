import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

import { RouterStepsModalProps } from "@/types/swap";

export default function RouterStepsModal({
  isOpen,
  onClose,
  route,
}: RouterStepsModalProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatAmount = (amount: string, decimals: number = 6) => {
    return parseFloat(amount).toFixed(decimals);
  };

  return (
    <Modal
      backdrop="blur"
      className="p-4"
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold text-white">Swap Route Details</h3>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Route Overview */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <CardBody className="p-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Route Overview
              </h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">From:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Image
                      alt={route.sourceChain?.networkName || "Unknown Chain"}
                      className="rounded-full"
                      height={20}
                      src={route.sourceChain?.chainIconURI || ""}
                      width={20}
                    />
                    <span className="text-white font-medium">
                      {route.sourceChain?.networkName || "Unknown Chain"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">To:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Image
                      alt={
                        route.destinationChain?.networkName || "Unknown Chain"
                      }
                      className="rounded-full"
                      height={20}
                      src={route.destinationChain?.chainIconURI || ""}
                      width={20}
                    />
                    <span className="text-white font-medium">
                      {route.destinationChain?.networkName || "Unknown Chain"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Estimated Time:</span>
                  <div className="text-white font-medium mt-1">
                    {formatTime(route.estimatedTime || 0)}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Price Impact:</span>
                  <div className="text-white font-medium mt-1">
                    {route.priceImpact || "N/A"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Step-by-Step Route */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">
              Transaction Steps
            </h4>

            {/* Step 1: Source Chain Swap */}
            <Card className="bg-green-900/20 border border-green-500/20">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-400">
                      Source Chain Swap
                    </h5>
                    <p className="text-sm text-gray-400">
                      Swap {route.sourceToken?.symbol || "TOKEN"} to IU2U on{" "}
                      {route.sourceChain?.networkName || "Unknown Chain"}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">DEX:</span>
                    <span className="text-white font-medium">
                      {route.sourceDexRoute?.dexName || "Unknown DEX"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-white">
                      {formatAmount(route.sourceDexRoute?.amountIn || "0")}{" "}
                      {route.sourceToken?.symbol || "TOKEN"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Output:</span>
                    <span className="text-white">
                      {formatAmount(route.sourceDexRoute?.amountOut || "0")}{" "}
                      IU2U
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gas Cost:</span>
                    <span className="text-white">
                      {route.sourceDexRoute?.estimatedGas || "0"} gas
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price Impact:</span>
                    <span className="text-white">
                      {route.sourceDexRoute?.impact || "N/A"}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Step 2: Cross-Chain Bridge */}
            <Card className="bg-blue-900/20 border border-blue-500/20">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-400">
                      Cross-Chain Bridge
                    </h5>
                    <p className="text-sm text-gray-400">
                      Bridge IU2U from{" "}
                      {route.sourceChain?.networkName || "Unknown Chain"} to{" "}
                      {route.destinationChain?.networkName || "Unknown Chain"}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bridge Protocol:</span>
                    <span className="text-white font-medium">IU2U Gateway</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">
                      {formatAmount(route.sourceDexRoute?.amountOut || "0")}{" "}
                      IU2U
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bridge Fee:</span>
                    <span className="text-white">
                      {formatAmount(route.bridgeFee || "0")} IU2U
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Time:</span>
                    <span className="text-white">
                      {formatTime(route.estimatedTime)}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Step 3: Destination Chain Swap */}
            <Card className="bg-purple-900/20 border border-purple-500/20">
              <CardBody className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-400">
                      Destination Chain Swap
                    </h5>
                    <p className="text-sm text-gray-400">
                      Swap IU2U to {route.destinationToken?.symbol || "TOKEN"}{" "}
                      on{" "}
                      {route.destinationChain?.networkName || "Unknown Chain"}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">DEX:</span>
                    <span className="text-white font-medium">
                      {route.destinationDexRoute?.dexName || "Unknown DEX"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-white">
                      {formatAmount(route.destinationDexRoute?.amountIn || "0")}{" "}
                      IU2U
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Output:</span>
                    <span className="text-white">
                      {formatAmount(
                        route.destinationDexRoute?.amountOut || "0",
                      )}{" "}
                      {route.destinationToken?.symbol || "TOKEN"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gas Cost:</span>
                    <span className="text-white">
                      {route.destinationDexRoute?.estimatedGas || "0"} gas
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price Impact:</span>
                    <span className="text-white">
                      {route.destinationDexRoute?.impact || "N/A"}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Route Summary */}
          <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <CardBody className="p-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                Route Summary
              </h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Gas Cost:</span>
                  <span className="text-white font-medium">
                    {route.totalGasCost || "0"} gas
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bridge Fee:</span>
                  <span className="text-white font-medium">
                    {formatAmount(route.bridgeFee || "0")} IU2U
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum Received:</span>
                  <span className="text-white font-medium">
                    {formatAmount(route.minimumReceived || "0")}{" "}
                    {route.destinationToken?.symbol || "TOKEN"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Route ID:</span>
                  <span className="text-white font-mono text-xs">
                    {route.routeId?.slice(0, 12) || "N/A"}...
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
