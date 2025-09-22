import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import axios from "axios";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import PoolFilters from "@/components/earn/PoolFilters";
import PoolTable from "@/components/earn/PoolTable";
import PoolPagination from "@/components/earn/PoolPagination";
import { PoolsResponse, Pool } from "@/types/earn";

const PoolsPage: NextPage = () => {
  const router = useRouter();
  const { category: initialCategory } = router.query;

  // State
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (initialCategory as string) || "highlighted_pool",
  );
  const [selectedChain, setSelectedChain] = useState<string>("1"); // Default to Ethereum (chainId: 1)
  const [selectedProtocol, setSelectedProtocol] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Available options
  const categories = [
    { key: "all", label: "📊 All Pools" },
    { key: "farming_pool", label: "🚜 Farming Pools" },
    { key: "highlighted_pool", label: "🔥 Highlighted Pools" },
    { key: "high_apr", label: "📈 High APR" },
    { key: "solid_earning", label: "💎 Solid Earning" },
    { key: "low_volatility", label: "🛡️ Low Volatility" },
  ];

  const chains = [
    { key: "1", label: "Ethereum" },
    { key: "56", label: "BSC" },
    { key: "137", label: "Polygon" },
    { key: "8453", label: "Base" },
    { key: "42161", label: "Arbitrum" },
    { key: "10", label: "Optimism" },
  ];

  const protocols = [
    { key: "all", label: "All Protocols" },
    { key: "uniswapv3", label: "Uniswap V3" },
    { key: "pancake-v3", label: "PancakeSwap V3" },
    { key: "sushiswap", label: "SushiSwap" },
    { key: "quickswap", label: "QuickSwap" },
  ];

  // Fetch pools data
  const fetchPools = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: any = {
        chainId: parseInt(selectedChain), // chainId is mandatory
        page: currentPage,
        limit: pageSize,
        interval: "7d",
      };

      // Only add tag parameter if not 'all'
      if (selectedCategory !== "all") {
        params.tag = selectedCategory;
      }

      if (selectedProtocol !== "all") {
        params.protocol = selectedProtocol;
      }

      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }

      const response = await axios.get<PoolsResponse>(
        process.env.NEXT_PUBLIC_FILTER_EARL_POOLS!,
        {
          params,
          timeout: 30000,
        },
      );

      if (response.data.code === 0) {
        setPools(response.data.data.pools);
        setTotalItems(response.data.data.pagination?.totalItems || 0);
      } else {
        setError("Failed to fetch pools data");
      }
    } catch (err) {
      console.error("Error fetching pools:", err);
      setError("Failed to load pools data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchPools();
  }, [selectedCategory, selectedChain, selectedProtocol]);

  // Fetch data when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchPools();
    }
  }, [currentPage]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        setCurrentPage(1); // Reset to first page when search changes
        fetchPools();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    router.push(`/earn/pools?category=${category}`, undefined, {
      shallow: true,
    });
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Earn Pools - IU2U</title>
        <meta
          content="Explore and add liquidity to high-yield pools"
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
              Explore Pools
            </h1>
          </div>
          <p className={subtitle({ class: "text-gray-300" })}>
            Discover high-yield liquidity pools and maximize your earnings with
            Zap Technology
          </p>
        </motion.div>

        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* Filters */}
            <Card className="bg-[#ffffff]/25 backdrop-blur-sm p-8 mb-6">
              <PoolFilters
                categories={categories}
                chains={chains}
                protocols={protocols}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                selectedChain={selectedChain}
                selectedProtocol={selectedProtocol}
                onCategoryChange={handleCategoryChange}
                onChainChange={setSelectedChain}
                onProtocolChange={setSelectedProtocol}
                onSearchChange={setSearchQuery}
              />

              {/* Results */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" />
                  <span className="ml-3 text-gray-300">Loading pools...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : (
                <>
                  <PoolTable pools={pools} totalItems={totalItems} />

                  {/* Pagination */}
                  <PoolPagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PoolsPage;
