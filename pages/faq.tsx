import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useRouter } from "next/router";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "what-is-iu2u",
    question: "What is IU2U (Interoperable U2U)?",
    answer:
      "IU2U is a revolutionary blockchain platform that enables gasless cross-chain interoperability through meta-transaction technology. It allows users to interact with multiple blockchain networks without worrying about gas fees, using U2U tokens as the primary gas currency across all supported chains.",
    category: "getting-started",
  },
  {
    id: "how-gasless-works",
    question: "How does the gasless meta-transaction system work?",
    answer:
      "Our gasless system uses meta-transactions where users sign transactions off-chain, and our relayer network executes them on-chain using U2U tokens. You pay gas fees in U2U regardless of which blockchain network you're transacting on, eliminating the need to hold native tokens for each chain.",
    category: "getting-started",
  },
  {
    id: "supported-networks",
    question: "Which blockchain networks are supported?",
    answer:
      "IU2U currently supports Ethereum, BNB Chain, Polygon, Optimism, Base, and Arbitrum. We're continuously expanding our network support to include more EVM-compatible chains and plan to add non-EVM chains in the future.",
    category: "getting-started",
  },

  // Using the Platform
  {
    id: "how-to-connect-wallet",
    question: "How do I connect my wallet?",
    answer:
      'Click the "Connect Wallet" button in the top-right corner of the page. Choose your preferred wallet (MetaMask, WalletConnect, etc.) and approve the connection. Once connected, you can access all platform features including gasless transactions and liquidity provision.',
    category: "using-platform",
  },
  {
    id: "deposit-u2u",
    question: "How do I deposit U2U tokens for gas credit?",
    answer:
      'Navigate to the MetaTx section and click "Deposit U2U". Select a supported token from your wallet, choose the amount, and confirm the transaction. The deposited tokens will be converted to U2U gas credits for gasless transactions.',
    category: "using-platform",
  },
  {
    id: "gasless-transfers",
    question: "How do I make gasless transfers?",
    answer:
      'Go to the MetaTx section, click "Gasless Batch Transfer", add recipient addresses and amounts, select tokens, and click "Review Transfer". Sign the meta-transaction and our relayer will execute it on-chain using your U2U gas credits.',
    category: "using-platform",
  },
  {
    id: "liquidity-pools",
    question: "How do I provide liquidity to pools?",
    answer:
      'Visit the Earn section and browse available pools. Click on any pool to view details, then click "Add Liquidity". Choose your token pair, enter amounts, and confirm the transaction. You\'ll start earning fees immediately.',
    category: "using-platform",
  },

  // Security & Safety
  {
    id: "is-platform-safe",
    question: "Is IU2U safe and secure?",
    answer:
      "Yes, IU2U implements industry-standard security practices including audited smart contracts, multi-signature wallets for treasury management, and comprehensive testing. All transactions are signed by users and executed through our secure relayer network.",
    category: "security",
  },
  {
    id: "private-keys",
    question: "Do you have access to my private keys?",
    answer:
      "No, IU2U never has access to your private keys. All transactions are signed locally in your wallet using standard cryptographic methods. Our relayer network only executes pre-signed transactions and cannot modify transaction details.",
    category: "security",
  },
  {
    id: "funds-security",
    question: "How are my funds protected?",
    answer:
      "Your funds remain in your wallet at all times. IU2U only facilitates transactions through meta-transactions. Smart contracts are audited by leading security firms, and we implement multiple layers of protection including rate limiting and transaction monitoring.",
    category: "security",
  },

  // Fees & Costs
  {
    id: "gas-fees",
    question: "What are the gas fees?",
    answer:
      "Gas fees are paid in U2U tokens regardless of the destination chain. The exact cost depends on network congestion and transaction complexity. You can view estimated costs before confirming any transaction.",
    category: "fees",
  },
  {
    id: "liquidity-fees",
    question: "What fees do liquidity providers earn?",
    answer:
      "Liquidity providers earn trading fees from swaps on the pools they provide liquidity to. Fee rates vary by pool (typically 0.01% to 1%) and are distributed proportionally based on your share of the pool.",
    category: "fees",
  },
  {
    id: "withdrawal-fees",
    question: "Are there withdrawal fees?",
    answer:
      "Withdrawal fees depend on the specific pool and network conditions. Some pools may have withdrawal fees to prevent impermanent loss exploitation, while others have no fees. Always check the pool details before withdrawing.",
    category: "fees",
  },

  // Troubleshooting
  {
    id: "transaction-failed",
    question: "What should I do if a transaction fails?",
    answer:
      "Check your wallet balance and ensure you have sufficient U2U gas credits. Verify network connectivity and try again. If the issue persists, check our status page for any ongoing network issues or contact support with your transaction hash.",
    category: "troubleshooting",
  },
  {
    id: "insufficient-credits",
    question: 'What does "Insufficient gas credits" mean?',
    answer:
      "You need U2U tokens deposited as gas credits to use gasless transactions. Deposit more U2U tokens to your gas credit balance, or use traditional transactions with native tokens if you prefer.",
    category: "troubleshooting",
  },
  {
    id: "pool-not-showing",
    question: "Why isn't my pool showing up?",
    answer:
      "Pools may not appear due to low liquidity, temporary maintenance, or network issues. Try refreshing the page or switching networks. If a specific pool is missing, it might have been removed due to low activity.",
    category: "troubleshooting",
  },

  // Advanced Features
  {
    id: "batch-transfers",
    question: "How do batch transfers work?",
    answer:
      "Batch transfers allow you to send multiple transactions in a single meta-transaction, saving gas costs. Add multiple recipients and amounts, review the batch, sign once, and our relayer executes all transfers efficiently.",
    category: "advanced",
  },
  {
    id: "cross-chain-swaps",
    question: "How do cross-chain swaps work?",
    answer:
      "Cross-chain swaps use our interoperability protocol to exchange tokens between different blockchain networks. The process is seamless - select source and destination chains, choose tokens, and confirm the swap. Gas fees are paid in U2U.",
    category: "advanced",
  },
  {
    id: "yield-optimization",
    question: "What is yield optimization?",
    answer:
      "Yield optimization automatically moves your liquidity between pools to maximize returns based on real-time data. This feature analyzes APRs, impermanent loss risk, and gas costs to optimize your position automatically.",
    category: "advanced",
  },
];

const categories = [
  { key: "getting-started", label: "🚀 Getting Started", color: "primary" },
  { key: "using-platform", label: "💡 Using the Platform", color: "secondary" },
  { key: "security", label: "🔒 Security & Safety", color: "success" },
  { key: "fees", label: "💰 Fees & Costs", color: "warning" },
  { key: "troubleshooting", label: "🔧 Troubleshooting", color: "danger" },
  { key: "advanced", label: "⚡ Advanced Features", color: "default" },
];

const FAQPage: NextPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <DefaultLayout>
      <Head>
        <title>FAQ - IU2U</title>
        <meta
          content="Frequently asked questions about IU2U platform, gasless transactions, and DeFi features"
          name="description"
        />
      </Head>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center gap-4 py-6 md:py-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="inline-block max-w-4xl text-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              Frequently Asked Questions
            </h1>
          </div>
          <p className={subtitle({ class: "text-gray-300" })}>
            Find answers to common questions about IU2U, gasless transactions,
            and our DeFi platform
          </p>
        </motion.div>

        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Search and Filters */}
            <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-6 mb-8">
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <input
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Search FAQs..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    color={selectedCategory === "all" ? "primary" : "default"}
                    size="sm"
                    variant={selectedCategory === "all" ? "solid" : "flat"}
                    onPress={() => setSelectedCategory("all")}
                  >
                    📋 All Questions
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.key}
                      color={
                        selectedCategory === category.key
                          ? (category.color as any)
                          : "default"
                      }
                      size="sm"
                      variant={
                        selectedCategory === category.key ? "solid" : "flat"
                      }
                      onPress={() => setSelectedCategory(category.key)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* FAQ Content */}
            <div className="space-y-6">
              {filteredFAQs.length > 0 ? (
                <Accordion className="space-y-4" variant="splitted">
                  {filteredFAQs.map((faq) => {
                    const categoryInfo = categories.find(
                      (cat) => cat.key === faq.category,
                    );

                    return (
                      <AccordionItem
                        key={faq.id}
                        aria-label={faq.question}
                        className="bg-[#ffffff]/20 backdrop-blur-sm border border-white/10"
                        title={
                          <div className="flex items-center gap-3">
                            <Chip
                              color={categoryInfo?.color as any}
                              size="sm"
                              variant="flat"
                            >
                              {categoryInfo?.label}
                            </Chip>
                            <span className="text-white font-medium">
                              {faq.question}
                            </span>
                          </div>
                        }
                      >
                        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <Card className="bg-[#ffffff]/25 backdrop-blur-sm">
                  <CardBody className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.5-2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No FAQs Found
                    </h3>
                    <p className="text-gray-400">
                      Try adjusting your search terms or category filter
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>

            {/* Contact Support */}
            <Card className="bg-[#ffffff]/25 backdrop-blur-sm mt-8">
              <CardBody className="text-center py-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-300 mb-6">
                  Can&apos;t find the answer you&apos;re looking for? Our
                  support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    color="primary"
                    variant="solid"
                    onPress={() => router.push("/support")}
                  >
                    Contact Support
                  </Button>
                  <Button
                    color="secondary"
                    variant="flat"
                    onPress={() => router.push("/docs")}
                  >
                    View Documentation
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default FAQPage;
