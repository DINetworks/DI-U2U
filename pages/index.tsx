import { useRouter } from "next/router";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import SmokeEffect from "@/components/SmokeEffect";

export default function IndexPage() {
  const router = useRouter();

  const navigateToPage = (link: string) => {
    router.push(link);
  };

  return (
    <div className="relative">
      <SmokeEffect className="opacity-60" />
      <DefaultLayout>
        {/* Hero Section */}
        <section className="relative z-10 flex flex-col bg-black/2 items-center justify-center gap-4 py-6 md:py-12">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="inline-block max-w-4xl text-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={title({ size: "lg", class: "gradient-metal" })}>
              Decentralized Interoperability <br />
              DI Protocol
            </h1>
            <h2 className={subtitle({ class: "mt-4 text-gray-300" })}>
              Revolutionizing Cross-Chain Interoperability with U2U as the
              Universal Gas Token & Gateway
            </h2>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-24 mt-16 w-full"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              className="bg-gradient-to-b from-[#474a4f] to-white-900 text-white hover:scale-105 transition-transform duration-300 cursor-pointer p-12"
              onPress={() => navigateToPage("/swap")}
            >
              <CardHeader className="pb-4">
                <h3 className="text-3xl text-success-800 text-center font-bold flex items-center justify-center">
                  Gasless Meta Transactions
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-xl mb-8">
                  <li>• Pay gas fees exclusively in U2U</li>
                  <li>• Seamless cross-chain swaps</li>
                  <li>• Meta-transaction relay system</li>
                  <li>• Reduced friction in DeFi interactions</li>
                </ul>
                <Button
                  as={Link}
                  className="font-semibold"
                  color="success"
                  href="/metatx"
                  variant="flat"
                >
                  Start Gasless transaction
                </Button>
              </CardBody>
            </Card>

            <Card
              className="bg-gradient-to-b from-[#474a4f] to-white-900 text-white hover:scale-105 transition-transform duration-300 cursor-pointer p-12"
              onPress={() => navigateToPage("/bridge")}
            >
              <CardHeader className="pb-4">
                <h3 className="text-3xl text-primary-800 text-center font-bold">
                  Cross-Chain Connectivity
                </h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-xl mb-8">
                  <li>• Cross-chain U2U token (U2U bridging)</li>
                  <li>• Smart contract execution across chains</li>
                  <li>• Generalized message passing</li>
                  <li>• Enhanced programmability</li>
                </ul>
                <Button
                  as={Link}
                  className="w-full font-semibold"
                  color="success"
                  href="/bridge"
                  variant="flat"
                >
                  Bridge Assets
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        </section>

        {/* Key Features Section */}
        <section className="py-8 md:py-16 mt-12">
          <div className="mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className={title({ size: "lg", class: "gradient-metal" })}>
                🚀 Key Features of the Protocol
              </h2>
              <p className={subtitle({ class: "mt-4 text-gray-300" })}>
                Built upon two core components for seamless interoperability
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Gasless Meta-Transaction System
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-md text-white/90 font-medium">
                      <li>• U2U as primary gas token across all chains</li>
                      <li>• Off-chain transaction signing</li>
                      <li>• Automatic U2U-to-native gas conversion</li>
                      <li>
                        • Meta-transaction relayers execute on behalf of users
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 7L12 3L4 7L12 11L20 7Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 12L12 16L20 12"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 17L12 21L20 17"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        Cross-Chain Connectivity
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-md text-white/90 font-medium">
                      <li>• Cross-chain U2U tokens</li>
                      <li>• 1:1 interchangeability across supported chains</li>
                      <li>• Data transmission and smart contract execution</li>
                      <li>• Expanded programmability for developers</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Components Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className={title({ size: "lg", class: "gradient-metal" })}>
                ⚙️ Main Components of the Protocol
              </h2>
              <p className={subtitle({ class: "mt-4 text-gray-300" })}>
                Robust infrastructure for efficient cross-chain operations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M2 17L12 22L22 17"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M2 12L12 17L22 12"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">
                        Gas Fee Abstraction
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Off-chain transaction signing</li>
                      <li>• U2U gas conversion</li>
                      <li>• Meta-transaction relayers</li>
                      <li>• Reduced gas costs</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="white"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">
                        Cross-Chain Bridge
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• Asset transfers</li>
                      <li>• Smart contract calls</li>
                      <li>• Generalized message passing</li>
                      <li>• Programmable interoperability</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardHeader className="pb-0 pt-6 px-6 text-center">
                    <div className="w-full">
                      <div className="flex justify-center">
                        <svg
                          fill="none"
                          height="60"
                          viewBox="0 0 24 24"
                          width="60"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            height="14"
                            rx="2"
                            stroke="white"
                            strokeWidth="2"
                            width="20"
                            x="2"
                            y="3"
                          />
                          <circle
                            cx="8"
                            cy="14"
                            r="2"
                            stroke="white"
                            strokeWidth="2"
                          />
                          <path
                            d="M16 10L18 8L20 10"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-4">
                        Cross-Chain Swap
                      </h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-6 pb-6">
                    <ul className="space-y-2 text-sm text-white/90 font-medium">
                      <li>• DEX Aggregator & Liquidity Router</li>
                      <li>• Slippage optimization</li>
                      <li>• Batch transactions</li>
                      <li>• Optimal routing algorithms</li>
                    </ul>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className={title({ size: "lg", class: "gradient-metal" })}>
                Use Cases & Ecosystem Expansion
              </h2>
              <p className={subtitle({ class: "mt-4" })}>
                DI Protocol powers the next generation of cross-chain DApps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardBody className="text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-lg font-bold mb-2">DEX Aggregators</h3>
                    <p className="text-sm text-white/80">
                      Cross-chain swap platforms
                    </p>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardBody className="text-center">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-lg font-bold mb-2">
                      Lending Protocols
                    </h3>
                    <p className="text-sm text-white/80">
                      Cross-chain borrowing & lending
                    </p>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardBody className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-bold mb-2">
                      Liquidity Provisioning
                    </h3>
                    <p className="text-sm text-white/80">
                      Multi-chain yield aggregation
                    </p>
                  </CardBody>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full bg-[#ffffff]/20 text-white hover:scale-105 transition-transform duration-300 p-4 backdrop-blur-sm">
                  <CardBody className="text-center">
                    <div className="text-4xl mb-4">🔗</div>
                    <h3 className="text-lg font-bold mb-2">
                      Staking & Farming
                    </h3>
                    <p className="text-sm text-white/80">
                      Cross-chain yield farming
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Strategic Impact Section */}
        <section className="py-12 md:py-16 bg-[#ffffff]/10 rounded-xl backdrop-blur-sm my-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={title({ size: "lg", class: "gradient-metal" })}>
              Strategic Impact for U2U
            </h2>
            <p
              className={subtitle({
                class: "mt-4 mb-8 max-w-4xl mx-auto text-gray-400",
              })}
            >
              By implementing DI Protocol, U2U establishes itself as a leader in
              blockchain interoperability, significantly enhancing U2U&apos;s
              core utility while driving adoption and network growth. This
              solution lays the groundwork for truly seamless, gas-efficient,
              and highly programmable cross-chain transactions—a critical step
              toward scaling DeFi beyond siloed ecosystems.
            </p>
            <div className="flex gap-8 justify-center">
              <Button
                as={Link}
                className="font-semibold"
                color="success"
                href="/docs"
                size="lg"
                variant="flat"
              >
                Learn More
              </Button>
              <Button
                as={Link}
                className="font-semibold"
                color="primary"
                href="/get-started"
                size="lg"
                variant="flat"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </section>
      </DefaultLayout>
    </div>
  );
}
