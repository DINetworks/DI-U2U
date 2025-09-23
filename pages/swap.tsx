// IU2U Cross-Chain Swap Page - Modular and Refactored
import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";

import DefaultLayout from "@/layouts/default";
import SwapForm from "@/components/swap/SwapForm";

const SwapPage: NextPage = () => {
  return (
    <DefaultLayout>
      <Head>
        <title>IU2U Cross-Chain Swap - DEX Aggregator</title>
        <meta
          content="Cross-chain token swaps powered by IU2U DEX aggregator with optimal routing across 30+ exchanges"
          name="description"
        />
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
            <h1 className="text-4xl font-bold gradient-metal">
              Cross-Chain Swap
            </h1>
          </div>
          <p className="text-gray-300 mt-4">
            Find the best rates across multiple DEXes and chains
          </p>
        </motion.div>

        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <SwapForm />
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default SwapPage;
