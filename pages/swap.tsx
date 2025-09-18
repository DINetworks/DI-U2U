// IU2U Cross-Chain Swap Page
import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { useWeb3 } from '@/hooks/useWeb3';
import { useTokenAndChainStore } from '@/store/useTokenAndChainStore';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useSwapQuote } from '@/hooks/useSwapQuote';

import GasFeeDisplay from '@/components/swap/GasFeeDisplay';
import RouterStepsModal from '@/components/swap/RouterStepsModal';
import SwapButton from '@/components/swap/SwapButton';
import TokenChainSelector from '@/components/swap/TokenChainSelector';
import ChainTokenSelectionModal from '@/components/swap/ChainTokenSelectionModal';

import { SwapToken, SwapChain, CrossChainRoute } from '@/types/swap';
import { executeSwap } from '@/utils/mockSwapApi';
// import { normalizeTokenLogoURI } from '@/utils/token';

const SwapPage: NextPage = () => {
  const { isConnected, address } = useWeb3();
  const { tokens: allTokens, chains: allChains } = useTokenAndChainStore(state => state);

  // Swap state
  const [sourceChain, setSourceChain] = useState<SwapChain | null>(null);
  const [destinationChain, setDestinationChain] = useState<SwapChain | null>(null);
  const [sourceToken, setSourceToken] = useState<SwapToken | null>(null);
  const [destinationToken, setDestinationToken] = useState<SwapToken | null>(null);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5); // 0.5%

  // UI state
  const [isExecutingSwap, setIsExecutingSwap] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<CrossChainRoute | null>(null);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectionType, setSelectionType] = useState<'source' | 'destination'>('source');
  const [chainSearch, setChainSearch] = useState('');
  const [tokenSearch, setTokenSearch] = useState('');
  const [selectedChainForTokens, setSelectedChainForTokens] = useState<SwapChain | null>(null);

  // Filter EVM chains only
  const evmChains = allChains.filter((chain: any) => chain.chainType === 'evm');

  // Filter tokens by selected chains
  const sourceTokens = allTokens.filter((token: any) =>
    !sourceChain || token.chainId.toString() === sourceChain.id
  );

  const destinationTokens = allTokens.filter((token: any) =>
    !destinationChain || token.chainId.toString() === destinationChain.id
  );

  // Get token balances
  const { data: sourceBalance } = useTokenBalance({
    tokenAddress: sourceToken?.address as `0x${string}`,
    accountAddress: address as `0x${string}`,
    decimals: sourceToken?.decimals || 18,
  });

  // Use the swap quote hook with auto-refresh
  const { quote, isLoading: isLoadingQuote, isError, error, refetch } = useSwapQuote({
    sourceChain,
    destinationChain,
    sourceToken,
    destinationToken,
    amount,
    slippage,
    enabled: !!sourceChain && !!destinationChain && !!sourceToken && !!destinationToken && !!amount
  });

  // Initialize default chains
  useEffect(() => {
    if (evmChains.length > 0 && !sourceChain) {
      // Set U2U Testnet as default source if available
      const u2uTestnet = evmChains.find((chain: any) => chain.id === '2484');
      setSourceChain(u2uTestnet || evmChains[0]);

      // Set Ethereum as default destination
      const ethereum = evmChains.find((chain: any) => chain.id === '1');
      setDestinationChain(ethereum || evmChains[1]);
    }
  }, [evmChains, sourceChain]);


  // Execute swap
  const handleSwap = async () => {
    if (!quote || !address) return;

    setIsExecutingSwap(true);

    try {
      const request = {
        routeId: quote.bestRoute.routeId,
        slippage,
        recipientAddress: address
      };

      const response = await executeSwap(request);

      if (response.success) {
        // Handle success
        console.log('Swap executed successfully:', response.data);
        // Reset form
        setAmount('');
      } else {
        console.error('Swap execution failed:', response.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Swap execution failed:', err instanceof Error ? err.message : 'Unknown error');
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

  // Open router modal
  const openRouterModal = (route: CrossChainRoute) => {
    setSelectedRoute(route);
    setIsRouterModalOpen(true);
  };

  // Selection mode handlers
  const enterSelectionMode = (type: 'source' | 'destination') => {
    setSelectionType(type);
    setIsSelectionMode(true);
    setChainSearch('');
    setTokenSearch('');
    setSelectedChainForTokens(null);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setChainSearch('');
    setTokenSearch('');
    setSelectedChainForTokens(null);
  };

  const handleChainClick = (chain: SwapChain) => {
    setSelectedChainForTokens(chain);
    setTokenSearch('');
  };

  const handleTokenChainSelect = (token: SwapToken, chain: SwapChain) => {
    if (selectionType === 'source') {
      setSourceToken(token);
      setSourceChain(chain);
    } else {
      setDestinationToken(token);
      setDestinationChain(chain);
    }
    exitSelectionMode();
  };

  // Filter chains and tokens for selection
  const filteredChains = evmChains.filter(chain =>
    chain.networkName.toLowerCase().includes(chainSearch.toLowerCase()) ||
    chain.nativeCurrency.symbol.toLowerCase().includes(chainSearch.toLowerCase())
  );

  const availableTokens = selectedChainForTokens
    ? allTokens.filter(token =>
        token.chainId.toString() === selectedChainForTokens.id &&
        (token.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
         token.name.toLowerCase().includes(tokenSearch.toLowerCase()))
      )
    : [];

  const isFormValid = sourceChain && destinationChain && sourceToken && destinationToken && amount;
  const canGetQuote = isFormValid && !isLoadingQuote;

  return (
    <DefaultLayout>
      <Head>
        <title>IU2U Cross-Chain Swap - DEX Aggregator</title>
        <meta name="description" content="Cross-chain token swaps powered by IU2U DEX aggregator with optimal routing across 30+ exchanges" />
      </Head>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center gap-4 py-6 md:py-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="inline-block max-w-2xl text-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4">
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              Cross-Chain Swap
            </h1>
          </div>
        </motion.div>

        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6">
              <CardHeader>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-2xl font-bold text-white">Exchange</h2>
                  <p className="text-gray-300 text-sm">
                    Find the best rates across multiple DEXes and chains
                  </p>
                </div>
              </CardHeader>

              <AnimatePresence mode="wait">
                {!isSelectionMode ? (
                  // Normal Swap Interface
                  <motion.div
                    key="swap-interface"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <CardBody className="space-y-6">
                      {/* Source Token & Chain Selector */}
                      <TokenChainSelector
                        label="From"
                        token={sourceToken}
                        chain={sourceChain}
                        balance={sourceBalance?.formatted}
                        onClick={() => enterSelectionMode('source')}
                        animationDelay={0.1}
                      />

                      {/* Amount Input */}
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-white">
                          Amount ({sourceToken?.symbol || 'TOKEN'})
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full p-4 bg-black/80 border border-white/20 rounded-2xl text-white text-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </motion.div>

                      {/* Switch Button */}
                      <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <Button
                          isIconOnly
                          variant="flat"
                          onPress={switchTokens}
                          className="bg-white/10 hover:bg-white/20"
                          size="lg"
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        </Button>
                      </motion.div>

                      {/* Destination Token & Chain Selector */}
                      <TokenChainSelector
                        label="To"
                        token={destinationToken}
                        chain={destinationChain}
                        onClick={() => enterSelectionMode('destination')}
                        animationDelay={0.3}
                      />

                     
                      {/* Slippage Settings */}
                      <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <span className="text-sm text-gray-300">Slippage Tolerance</span>
                        <div className="flex gap-2">
                          {[0.1, 0.5, 1.0].map((value, index) => (
                            <motion.div
                              key={value}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + (index * 0.1), duration: 0.2 }}
                            >
                              <Button
                                size="sm"
                                color="warning"
                                variant={slippage === value ? "solid" : "flat"}
                                onPress={() => setSlippage(value)}
                                className="text-xs"
                              >
                                {value}%
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Quote Display */}
                      {quote && (
                        <Card className="bg-green-900/20 border border-green-500/20">
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-green-400">Best Route Found</h4>
                              <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                onPress={() => openRouterModal(quote.bestRoute)}
                                className="text-xs"
                              >
                                View Details
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">You Pay:</span>
                                <div className="text-white font-medium">
                                  {quote.sourceAmount} {sourceToken?.symbol}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">You Receive:</span>
                                <div className="text-white font-medium">
                                  {quote.destinationAmount} {destinationToken?.symbol}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Exchange Rate:</span>
                                <div className="text-white font-medium">
                                  1 {sourceToken?.symbol} = {quote.exchangeRate} {destinationToken?.symbol}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Estimated Time:</span>
                                <div className="text-white font-medium">
                                  {Math.floor(quote.bestRoute.estimatedTime / 60)}m {quote.bestRoute.estimatedTime % 60}s
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      )}

                      {/* Gas Fee Display */}
                      {quote && (
                        <GasFeeDisplay
                          gasCost={quote.bestRoute.totalGasCost}
                          bridgeFee={quote.bestRoute.bridgeFee}
                          totalCost={(parseFloat(quote.bestRoute.totalGasCost) + parseFloat(quote.bestRoute.bridgeFee)).toString()}
                          currency="IU2U"
                        />
                      )}

                      {/* Error Display */}
                      {isError && error && (
                        <Card className="bg-red-900/20 border border-red-500/20">
                          <CardBody className="p-4">
                            <p className="text-red-400 text-sm">{error.message}</p>
                          </CardBody>
                        </Card>
                      )}

                      {/* Loading State */}
                      {isLoadingQuote && (
                        <div className="flex items-center justify-center gap-3 py-4">
                          <Spinner size="sm" />
                          <span className="text-gray-300">Finding optimal routes across 30+ DEXes...</span>
                        </div>
                      )}

                      {/* Swap Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                      >
                        <SwapButton
                          onClick={handleSwap}
                          disabled={!canGetQuote || !quote}
                          loading={isLoadingQuote || isExecutingSwap}
                          quote={quote}
                        >
                          Execute Swap
                        </SwapButton>
                      </motion.div>

                      
                    </CardBody>
                  </motion.div>
                ) : (
                  // Selection Interface
                  <ChainTokenSelectionModal
                    selectionType={selectionType}
                    chains={evmChains}
                    tokens={allTokens}
                    selectedChain={selectedChainForTokens}
                    chainSearch={chainSearch}
                    tokenSearch={tokenSearch}
                    onChainSearchChange={setChainSearch}
                    onTokenSearchChange={setTokenSearch}
                    onChainClick={handleChainClick}
                    onTokenSelect={handleTokenChainSelect}
                    onCancel={exitSelectionMode}
                  />
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Router Steps Modal */}
      {selectedRoute && <RouterStepsModal
        isOpen={isRouterModalOpen}
        onClose={() => setIsRouterModalOpen(false)}
        route={selectedRoute!}
      />}
    </DefaultLayout>
  );
};

export default SwapPage;