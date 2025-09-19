import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/router";
import axios from "axios";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import CategorySection from "@/components/earn/CategorySection";
import { EarnPoolsResponse } from "@/types/earn";

const EarnPage: NextPage = () => {
  const router = useRouter();
  const [poolsData, setPoolsData] = useState<EarnPoolsResponse["data"] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolsData = async () => {
      try {
        const response = await axios.get<EarnPoolsResponse>(
          process.env.NEXT_PUBLIC_EARN_POOLS!,
          { timeout: 30000 },
        );

        if (response.data.code === 0) {
          setPoolsData(response.data.data);
        } else {
          setError("Failed to fetch pools data");
        }
      } catch (err) {
        console.error("Error fetching pools data:", err);
        setError("Failed to load pools data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolsData();
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>Smart Earn - IU2U</title>
        <meta
          content="Earn from Liquidity Provisioning with Zap Technology"
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
              Earn from Liquidity Provisioning
            </h1>
          </div>
          <p className={subtitle({ class: "text-gray-300" })}>
            Unlock the full potential of your assets. Offering data, tools, and
            utilities—centered around Zap technology—to help you maximize
            earnings from your liquidity across various DeFi protocols.
          </p>
        </motion.div>

        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Liquidity Pools Card */}
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-4">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">
                    Liquidity Pools
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-300 mb-4">
                    Explore and instantly add liquidity to high-APY pools the
                    easy way with Zap Technology.
                  </p>
                  <Button
                    className="w-full"
                    color="primary"
                    variant="solid"
                    onPress={() => router.push("/earn/pools")}
                  >
                    Explore Pools
                  </Button>
                </CardBody>
              </Card>

              {/* Liquidity Positions Card */}
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-4">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">
                    Liquidity Positions
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-300 mb-4">
                    Track, adjust, and optimize your positions to stay in
                    control of your DeFi journey.
                  </p>
                  <Button
                    className="w-full"
                    color="success"
                    variant="solid"
                    onPress={() => router.push("/earn/positions")}
                  >
                    Explore My Positions
                  </Button>
                </CardBody>
              </Card>
            </div>

            {/* Pool Categories */}
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" />
                  <span className="ml-3 text-gray-300">Loading pools...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : poolsData ? (
                <>
                  <CategorySection
                    category="farming_pool"
                    pools={poolsData.farmingPools || []}
                    title="🚜 Farming Pools"
                  />

                  <CategorySection
                    category="highlighted_pool"
                    pools={poolsData.highlightedPools}
                    title="🔥 Highlighted Pools"
                  />

                  <CategorySection
                    category="high_apr"
                    pools={poolsData.highAPR}
                    title="📈 High APR"
                  />

                  <CategorySection
                    category="solid_earning"
                    pools={poolsData.solidEarning}
                    title="💎 Solid Earning"
                  />

                  <CategorySection
                    category="low_volatility"
                    pools={poolsData.lowVolatility}
                    title="🛡️ Low Volatility"
                  />
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default EarnPage;
