import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { useWeb3 } from "@/hooks/useWeb3";
import { useTokenAndChainStore } from "@/store/useTokenAndChainStore";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useSwapQuote } from "@/hooks/useSwapQuote";
import RouterStepsModal from "@/components/swap/RouterStepsModal";
import SwapButton from "@/components/swap/SwapButton";
import TokenChainSelector from "@/components/swap/TokenChainSelector";
import ChainTokenSelectionModal from "@/components/swap/ChainTokenSelectionModal";
import SwapRoutes from "@/components/swap/SwapRoutes";
import Fees from "@/components/swap/Fees";
import RouteDetails from "@/components/swap/RouteDetails";
import { SwapToken, SwapChain, CrossChainRoute } from "@/types/swap";
import { executeSwap } from "@/utils/mockSwapApi";
import SwithchToken from "./SwithchToken";
import SlippageSetting from "./Slippage";

interface SwapFormProps {
  onExecuteSwap?: (result: any) => void;
}

export default function SwapForm({ onExecuteSwap }: SwapFormProps) {
  const { address } = useWeb3();
  const { tokens: allTokens, chains: allChains } = useTokenAndChainStore(
    (state) => state,
  );

  // Swap state
  const [sourceChain, setSourceChain] = useState<SwapChain | null>(null);
  const [destinationChain, setDestinationChain] = useState<SwapChain | null>(
    null,
  );
  const [sourceToken, setSourceToken] = useState<SwapToken | null>(null);
  const [destinationToken, setDestinationToken] = useState<SwapToken | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5); // 0.5%

  // UI state
  const [isExecutingSwap, setIsExecutingSwap] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [selectedRoute] = useState<CrossChainRoute | null>(null);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionType, setSelectionType] = useState<"source" | "destination">(
    "source",
  );
  const [chainSearch, setChainSearch] = useState("");
  const [tokenSearch, setTokenSearch] = useState("");
  const [selectedChainForTokens, setSelectedChainForTokens] =
    useState<SwapChain | null>(null);

  // Flip animation states
  const [showRoutesDetails, setShowRoutesDetails] = useState(false);
  const [showFeesDetails, setShowFeesDetails] = useState(false);

  // Filter EVM chains only
  const evmChains = allChains.filter((chain: any) => chain.chainType === "evm");

  // Get token balances
  const { data: sourceBalance } = useTokenBalance({
    tokenAddress: sourceToken?.address as `0x${string}`,
    accountAddress: address as `0x${string}`,
    decimals: sourceToken?.decimals || 18,
  });

  // Use the swap quote hook with auto-refresh
  const {
    quote,
    isLoading: isLoadingQuote,
    isError,
    error,
  } = useSwapQuote({
    sourceChain,
    destinationChain,
    sourceToken,
    destinationToken,
    amount,
    slippage,
    enabled:
      !!sourceChain &&
      !!destinationChain &&
      !!sourceToken &&
      !!destinationToken &&
      !!amount,
  });

  // Initialize default chains
  useEffect(() => {
    if (evmChains.length > 0 && !sourceChain) {
      // Set U2U Testnet as default source if available
      const u2uTestnet = evmChains.find((chain: any) => chain.id === "2484");

      setSourceChain(u2uTestnet || evmChains[0]);

      // Set Ethereum as default destination
      const ethereum = evmChains.find((chain: any) => chain.id === "1");

      setDestinationChain(ethereum || evmChains[1]);
    }
  }, [evmChains, sourceChain]);

  // Execute swap
  const handleSwap = async () => {
    if (!quote || !address) return;

    setIsExecutingSwap(true);

    try {
      const response = await executeSwap();

      if (response.success) {
        setAmount("");
        onExecuteSwap?.(response);
      } else {
        console.error(
          "Swap execution failed:",
          response.error || "Unknown error",
        );
      }
    } catch (err) {
      console.error(
        "Swap execution failed:",
        err instanceof Error ? err.message : "Unknown error",
      );
    } finally {
      setIsExecutingSwap(false);
    }
  };

  // Switch source and destination
  const switchTokens = () => {
    const tempChain = sourceChain;
    const tempToken = sourceToken;

    setSourceChain(destinationChain);
    setSourceToken(destinationToken);
    setDestinationChain(tempChain);
    setDestinationToken(tempToken);
  };

  // Selection mode handlers
  const enterSelectionMode = (type: "source" | "destination") => {
    setSelectionType(type);
    setIsSelectionMode(true);
    setChainSearch("");
    setTokenSearch("");
    setSelectedChainForTokens(null);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setChainSearch("");
    setTokenSearch("");
    setSelectedChainForTokens(null);
  };

  const handleChainClick = (chain: SwapChain) => {
    setSelectedChainForTokens(chain);
    setTokenSearch("");
  };

  const handleTokenChainSelect = (token: SwapToken, chain: SwapChain) => {
    if (selectionType === "source") {
      setSourceToken(token);
      setSourceChain(chain);
    } else {
      setDestinationToken(token);
      setDestinationChain(chain);
    }
    exitSelectionMode();
  };

  const isFormValid =
    sourceChain &&
    destinationChain &&
    sourceToken &&
    destinationToken &&
    amount;
  const canGetQuote = isFormValid && !isLoadingQuote;

  return (
    <>
      <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white">Exchange</h2>
            <p className="text-gray-300 text-sm">
              Find the best rates across multiple DEXes and chains
            </p>
          </div>
        </CardHeader>

        <AnimatePresence mode="wait">
          {!isSelectionMode ? (
            showRoutesDetails ? (
              // Routes Details View
              <motion.div
                key="routes-details"
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <CardBody className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Route Details
                    </h3>
                    <Button
                      color="warning"
                      size="sm"
                      variant="flat"
                      onPress={() => setShowRoutesDetails(false)}
                    >
                      Back
                    </Button>
                  </div>

                  {/* Route Details Component with Collapsible Accordions */}
                  {quote && (
                    <RouteDetails
                      destinationToken={destinationToken}
                      quote={quote}
                      route={quote.bestRoute}
                      sourceToken={sourceToken}
                    />
                  )}
                </CardBody>
              </motion.div>
            ) : showFeesDetails ? (
              // Fees Details View
              <motion.div
                key="fees-details"
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: 20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <CardBody className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Fee Breakdown
                    </h3>
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => setShowFeesDetails(false)}
                    >
                      Back
                    </Button>
                  </div>

                  {/* Fee Breakdown */}
                  {quote && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-black/60 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Gas Fee</span>
                            <span className="text-white font-medium">
                              {parseFloat(quote.bestRoute.totalGasCost).toFixed(
                                6,
                              )}{" "}
                              IU2U
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Network transaction fee
                          </div>
                        </div>

                        <div className="p-4 bg-black/60 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Bridge Fee</span>
                            <span className="text-white font-medium">
                              {parseFloat(quote.bestRoute.bridgeFee).toFixed(6)}{" "}
                              IU2U
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Cross-chain transfer fee
                          </div>
                        </div>

                        <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-green-400 font-medium">
                              Total Cost
                            </span>
                            <span className="text-green-400 font-bold">
                              {(
                                parseFloat(quote.bestRoute.totalGasCost) +
                                parseFloat(quote.bestRoute.bridgeFee)
                              ).toFixed(6)}{" "}
                              IU2U
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </motion.div>
            ) : (
              // Normal Swap Interface
              <motion.div
                key="swap-interface"
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <CardBody>
                  {/* Source Token & Chain Selector */}
                  <TokenChainSelector
                    animationDelay={0.1}
                    balance={sourceBalance?.formatted}
                    chain={sourceChain}
                    label="From"
                    token={sourceToken}
                    amount={amount}
                    setAmount={setAmount}
                    onClick={() => enterSelectionMode("source")}
                  />

                  {/* Switch Tokens Button in the middle */}
                  <SwithchToken 
                    className="-mt-4"
                    switchTokens={switchTokens}/>

                  {/* Destination Token & Chain Selector */}
                  <TokenChainSelector
                    animationDelay={0.3}
                    chain={destinationChain}
                    label="To"
                    token={destinationToken}
                    amount={amount}
                    setAmount={setAmount}
                    onClick={() => enterSelectionMode("destination")}
                  />
                  
                  {/* SwapRoutes, Switch Button, and Fees Row */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {/* SwapRoutes on the left */}
                    <SwapRoutes
                      animationDelay={0.4}
                      route={quote?.bestRoute}
                      onClick={() => setShowRoutesDetails(!showRoutesDetails)}
                    />

                    {/* Fees on the right */}
                    <Fees
                      animationDelay={0.4}
                      currency="IU2U"
                      totalCost={
                        quote
                          ? (
                              parseFloat(quote.bestRoute.totalGasCost) +
                              parseFloat(quote.bestRoute.bridgeFee)
                            ).toString()
                          : "0"
                      }
                      onClick={() => setShowFeesDetails(!showFeesDetails)}
                    />
                  </motion.div>

                  {/* Slippage Settings */}
                  <SlippageSetting 
                    slippage={slippage} 
                    setSlippage={setSlippage} 
                  />

                  {/* Error Display */}
                  {isError && error && (
                    <Card className="bg-red-900/20 border border-red-500/20 mt-3">
                      <CardBody className="p-4">
                        <p className="text-red-400 text-sm">{error.message}</p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Loading State */}
                  {isLoadingQuote && (
                    <div className="flex items-center justify-center gap-3 py-4">
                      <Spinner size="sm" />
                      <span className="text-gray-300">
                        Finding optimal routes across 30+ DEXes...
                      </span>
                    </div>
                  )}

                  {/* Swap Button */}
                  <motion.div
                    className="mt-6"
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <SwapButton
                      canGetQuote={!!canGetQuote}
                      disabled={!canGetQuote || !quote}
                      loading={isLoadingQuote || isExecutingSwap}
                      quote={quote}
                      onClick={handleSwap}
                    >
                      Execute Swap
                    </SwapButton>
                  </motion.div>
                </CardBody>
              </motion.div>
            )
          ) : (
            // Selection Interface
            <ChainTokenSelectionModal
              chainSearch={chainSearch}
              chains={evmChains}
              selectedChain={selectedChainForTokens}
              selectionType={selectionType}
              tokenSearch={tokenSearch}
              tokens={allTokens}
              onCancel={exitSelectionMode}
              onChainClick={handleChainClick}
              onChainSearchChange={setChainSearch}
              onTokenSearchChange={setTokenSearch}
              onTokenSelect={handleTokenChainSelect}
            />
          )}
        </AnimatePresence>
      </Card>

      {/* Router Steps Modal */}
      {selectedRoute && (
        <RouterStepsModal
          isOpen={isRouterModalOpen}
          route={selectedRoute!}
          onClose={() => setIsRouterModalOpen(false)}
        />
      )}
    </>
  );
}
