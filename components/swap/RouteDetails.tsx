import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody } from "@heroui/card";

import { CrossChainRoute, SwapQuote, SwapToken } from "@/types/swap";

interface RouteStep {
  id: number;
  title: string;
  description: string;
  amount?: string;
  time?: string;
  details?: string[];
}

interface RouteDetailsProps {
  route: CrossChainRoute;
  quote?: SwapQuote;
  sourceToken?: SwapToken | null;
  destinationToken?: SwapToken | null;
}

export default function RouteDetails({
  route,
  quote,
  sourceToken,
  destinationToken,
}: RouteDetailsProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Mock route steps - in real app, this would come from route data
  const routeSteps: RouteStep[] = [
    {
      id: 1,
      title: "Uniswap V3",
      description: "Swap on Ethereum",
      amount: "2.5 ETH",
      time: "~30s",
      details: [
        "Exchange rate: 1 ETH = 1800 USDC",
        "Liquidity pool: ETH/USDC 0.3%",
        "Gas estimate: 150,000 gas",
        "Slippage protection: 0.5%",
      ],
    },
    {
      id: 2,
      title: "Stargate Bridge",
      description: "Bridge to Polygon",
      amount: "1800 USDC",
      time: "~2 min",
      details: [
        "Bridge protocol: Stargate Finance",
        "Source chain: Ethereum",
        "Destination chain: Polygon",
        "Bridge fee: 0.001 ETH",
        "Estimated confirmation: 12 blocks",
      ],
    },
    {
      id: 3,
      title: "QuickSwap",
      description: "Final swap on Polygon",
      amount: "1000 USDC",
      time: "~45s",
      details: [
        "Exchange rate: 1 USDC = 0.97 MATIC",
        "Liquidity pool: USDC/MATIC",
        "Gas estimate: 200,000 gas",
        "Network fee: ~0.01 MATIC",
      ],
    },
  ];

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="space-y-6">
      {/* Quote Details Card */}
      {quote && sourceToken && destinationToken && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Quote Details</h4>
          <Card className="bg-green-900/20 border border-green-500/20">
            <CardBody className="p-4">
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-green-400">
                  Best Route Found
                </h5>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">You Pay:</span>
                  <div className="text-white font-medium">
                    {quote.sourceAmount} {sourceToken.symbol}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">You Receive:</span>
                  <div className="text-white font-medium">
                    {quote.destinationAmount} {destinationToken.symbol}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Exchange Rate:</span>
                  <div className="text-white font-medium">
                    1 {sourceToken.symbol} = {quote.exchangeRate}{" "}
                    {destinationToken.symbol}
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Estimated Time:</span>
                  <div className="text-white font-medium">
                    {Math.floor(route.estimatedTime / 60)}m{" "}
                    {route.estimatedTime % 60}s
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Route Steps with Collapsible Accordions */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-white">Route Steps</h4>
        <div className="space-y-3">
          {routeSteps.map((step, index) => (
            <motion.div
              key={step.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="bg-black/60 border border-white/10">
                <CardBody className="p-0">
                  {/* Step Header - Clickable */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleStep(step.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleStep(step.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Step Number */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          expandedStep === step.id
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        {step.id}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {step.title}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {step.description}
                        </div>
                      </div>
                    </div>

                    {/* Step Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {step.amount && <span>{step.amount}</span>}
                      {step.time && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" strokeWidth={2} />
                            <path d="M12 6v6l4 2" strokeWidth={2} />
                          </svg>
                          <span>{step.time}</span>
                        </div>
                      )}

                      {/* Expand/Collapse Icon */}
                      <motion.div
                        animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 9l-7 7-7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Step Details - Collapsible */}
                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        animate={{ height: "auto", opacity: 1 }}
                        className="overflow-hidden"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-4 border-t border-white/10">
                          <div className="pt-4 space-y-2">
                            {step.details?.map((detail, detailIndex) => (
                              <motion.div
                                key={detailIndex}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-sm text-gray-300"
                                initial={{ opacity: 0, x: -10 }}
                                transition={{
                                  delay: detailIndex * 0.05,
                                  duration: 0.2,
                                }}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                                <span>{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
