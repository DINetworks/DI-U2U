import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { motion } from "framer-motion";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function PremiumAuctionsPage() {
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className={title({ className: "gradient-metal" })}>
              Premium Domain Auctions
            </h1>
            <p className="text-gray-600 mt-2">
              Single domain auctions with 4-tier price betting mechanism
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              color={activeTab === "browse" ? "primary" : "default"}
              variant={activeTab === "browse" ? "solid" : "bordered"}
              onPress={() => setActiveTab("browse")}
            >
              Browse Auctions
            </Button>
            <Button
              color={activeTab === "create" ? "primary" : "default"}
              variant={activeTab === "create" ? "solid" : "bordered"}
              onPress={() => setActiveTab("create")}
            >
              Create Premium Auction
            </Button>
          </div>

          {activeTab === "browse" ? (
            <Card className="p-4">
              <CardBody className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">
                  Premium Auctions Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Single domain auctions with betting on price outcomes
                </p>
                <div className="space-y-4 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>First bid wins and ends auction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>4-tier price betting system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Commit-reveal betting mechanism</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Configurable reward distribution</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="p-4">
              <CardHeader>
                <h3 className="text-xl font-semibold">
                  Create Premium Auction
                </h3>
              </CardHeader>
              <CardBody className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">
                  Premium Auction Creation Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Create single domain auctions with betting functionality
                </p>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
