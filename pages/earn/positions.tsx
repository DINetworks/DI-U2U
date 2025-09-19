import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { title, subtitle } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { useRouter } from 'next/router';
import { useWeb3 } from '@/hooks/useWeb3';

const PositionsPage: NextPage = () => {
  const router = useRouter();
  const { address } = useWeb3();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user's positions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>My Positions - IU2U</title>
        <meta name="description" content="Track and manage your liquidity positions" />
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
              My Liquidity Positions
            </h1>
          </div>
          <p className={subtitle({ class: "text-gray-300" })}>
            Track, adjust, and optimize your positions to stay in control of your DeFi journey
          </p>
        </motion.div>

        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {!address ? (
              <Card className="bg-[#ffffff]/25 backdrop-blur-sm">
                <CardBody className="text-center py-12">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Connect Your Wallet
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Connect your wallet to view and manage your liquidity positions
                  </p>
                  <Button color="primary" size="lg">
                    Connect Wallet
                  </Button>
                </CardBody>
              </Card>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
                <span className="ml-3 text-gray-300">Loading your positions...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#ffffff]/25 backdrop-blur-sm">
                    <CardBody className="text-center">
                      <h4 className="text-lg font-semibold text-white mb-2">Total Value Locked</h4>
                      <p className="text-2xl font-bold text-green-400">$0.00</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-[#ffffff]/25 backdrop-blur-sm">
                    <CardBody className="text-center">
                      <h4 className="text-lg font-semibold text-white mb-2">Active Positions</h4>
                      <p className="text-2xl font-bold text-blue-400">0</p>
                    </CardBody>
                  </Card>

                  <Card className="bg-[#ffffff]/25 backdrop-blur-sm">
                    <CardBody className="text-center">
                      <h4 className="text-lg font-semibold text-white mb-2">Total Earnings</h4>
                      <p className="text-2xl font-bold text-purple-400">$0.00</p>
                    </CardBody>
                  </Card>
                </div>

                {/* Positions List */}
                <Card className="bg-[#ffffff]/25 backdrop-blur-sm">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-white">Your Positions</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📊</div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        No Positions Found
                      </h4>
                      <p className="text-gray-300 mb-6">
                        You haven't added liquidity to any pools yet. Start earning by exploring available pools.
                      </p>
                      <Button
                        color="primary"
                        size="lg"
                        onPress={() => router.push('/earn/pools')}
                      >
                        Explore Pools
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default PositionsPage;