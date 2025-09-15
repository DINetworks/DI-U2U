import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Link } from "@heroui/link";
import { motion } from "framer-motion";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useWeb3 } from "@/hooks/useWeb3";
import { NotConnected } from "@/components/hybrid/create/NotConnected";
import { useWalletModal } from "@/contexts/WalletContext";

interface UserAuction {
  id: number;
  tokenCount: number;
  startPrice: string;
  currentPrice: string;
  reservePrice: string;
  timeLeft: string;
  filled: number;
  status: "active" | "ended" | "cleared";
  totalBids: number;
  createdAt: string;
}

interface UserBid {
  auctionId: number;
  type: "soft" | "hard";
  threshold?: string;
  currentPrice: string;
  fraction: number;
  status: "pending" | "converted" | "refunded";
  placedAt: string;
  bondAmount?: string;
}

const mockUserAuctions: UserAuction[] = [
  {
    id: 1,
    tokenCount: 3,
    startPrice: "0.1",
    currentPrice: "0.082",
    reservePrice: "0.07",
    timeLeft: "2h 15m",
    filled: 65,
    status: "active",
    totalBids: 2,
    createdAt: "2025-09-02",
  },
  {
    id: 4,
    tokenCount: 4,
    startPrice: "0.1",
    currentPrice: "0.0934",
    reservePrice: "0.07",
    timeLeft: "Ended",
    filled: 3,
    status: "cleared",
    totalBids: 4,
    createdAt: "2025-09-03",
  },
];

const mockUserBids: UserBid[] = [
  {
    auctionId: 2,
    type: "soft",
    threshold: "420",
    currentPrice: "450",
    fraction: 25,
    status: "pending",
    placedAt: "2025-09-03",
    bondAmount: "0.03",
  },
  {
    auctionId: 3,
    type: "hard",
    currentPrice: "85",
    fraction: 100,
    status: "converted",
    placedAt: "2025-09-04",
  },
  {
    auctionId: 5,
    type: "soft",
    threshold: "200",
    currentPrice: "180",
    fraction: 50,
    status: "refunded",
    placedAt: "2025-09-05",
    bondAmount: "0.08",
  },
];

export default function MyAuctionsPage() {
  const { isConnected, address } = useWeb3();
  const { openConnectModal } = useWalletModal();
  const [activeTab, setActiveTab] = useState("created");

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
              My Auctions
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your created auctions and track your bids
            </p>
          </div>

          {!isConnected ? (
            <NotConnected onConnectClick={() => openConnectModal?.()} />
          ) : (
            <Tabs
              className="mb-6"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
            >
              <Tab key="created" title="Created Auctions">
                <div className="space-y-6">
                  {mockUserAuctions.length === 0 ? (
                    <Card className="p-4">
                      <CardBody className="text-center py-12">
                        <h3 className="text-lg font-semibold mb-2">
                          No auctions created
                        </h3>
                        <p className="text-gray-600 mb-4">
                          You haven&apos;t created any auctions yet
                        </p>
                        <Button as={Link} color="primary" href="/hybrid/create">
                          Create Your First Auction
                        </Button>
                      </CardBody>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {mockUserAuctions.map((auction, index) => (
                        <motion.div
                          key={auction.id}
                          animate={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full p-4">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start w-full">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    Auction #{auction.id}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {auction.tokenCount} tokens • Created{" "}
                                    {auction.createdAt}
                                  </p>
                                </div>
                                <Chip
                                  color={
                                    auction.status === "active"
                                      ? "success"
                                      : auction.status === "cleared"
                                        ? "primary"
                                        : "default"
                                  }
                                  variant="flat"
                                >
                                  {auction.status}
                                </Chip>
                              </div>
                            </CardHeader>

                            <CardBody className="pt-0">
                              <div className="space-y-4">
                                {/* Price Info */}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Current Price:</span>
                                    <span className="font-semibold">
                                      {auction.status === "cleared"
                                        ? "Sold"
                                        : `${auction.currentPrice} ETH`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>Started at:</span>
                                    <span>{auction.startPrice} ETH</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500">
                                    <span>Reserve:</span>
                                    <span>{auction.reservePrice} ETH</span>
                                  </div>
                                </div>

                                {/* Progress */}
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Filled:</span>
                                    <span>{auction.filled}%</span>
                                  </div>
                                  <Progress
                                    color={
                                      auction.filled === 100
                                        ? "success"
                                        : auction.filled > 50
                                          ? "warning"
                                          : "primary"
                                    }
                                    size="sm"
                                    value={auction.filled}
                                  />
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex justify-between">
                                    <span>Total Bids:</span>
                                    <span className="font-semibold">
                                      {auction.totalBids}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Time Left:</span>
                                    <span className="font-semibold">
                                      {auction.timeLeft}
                                    </span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button
                                    as={Link}
                                    className="flex-1"
                                    color="primary"
                                    href={`/hybrid/${auction.id}`}
                                    size="sm"
                                    variant="bordered"
                                  >
                                    View Details
                                  </Button>
                                  {auction.status === "active" && (
                                    <Button
                                      color="secondary"
                                      size="sm"
                                      variant="light"
                                    >
                                      Manage
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Tab>

              <Tab key="bids" title="My Bids">
                <div className="space-y-6">
                  {mockUserBids.length === 0 ? (
                    <Card className="p-4">
                      <CardBody className="text-center py-12">
                        <h3 className="text-lg font-semibold mb-2">
                          No bids placed
                        </h3>
                        <p className="text-gray-600 mb-4">
                          You haven&apos;t placed any bids yet
                        </p>
                        <Button as={Link} color="primary" href="/hybrid">
                          Browse Auctions
                        </Button>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="p-4">
                      <CardHeader>
                        <h3 className="text-lg font-semibold">Bid History</h3>
                      </CardHeader>
                      <CardBody>
                        <Table aria-label="Bid history table">
                          <TableHeader>
                            <TableColumn>AUCTION</TableColumn>
                            <TableColumn>TYPE</TableColumn>
                            <TableColumn>PRICE/THRESHOLD</TableColumn>
                            <TableColumn>FRACTION</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>BOND</TableColumn>
                            <TableColumn>DATE</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {mockUserBids.map((bid, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Link href={`/hybrid/${bid.auctionId}`}>
                                    Auction #{bid.auctionId}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    color={
                                      bid.type === "soft"
                                        ? "primary"
                                        : "secondary"
                                    }
                                    size="sm"
                                    variant="flat"
                                  >
                                    {bid.type}
                                  </Chip>
                                </TableCell>
                                <TableCell>
                                  {bid.type === "soft"
                                    ? `${bid.threshold} ETH`
                                    : `${bid.currentPrice} ETH`}
                                </TableCell>
                                <TableCell>{bid.fraction}%</TableCell>
                                <TableCell>
                                  <Chip
                                    color={
                                      bid.status === "converted"
                                        ? "success"
                                        : bid.status === "pending"
                                          ? "warning"
                                          : "default"
                                    }
                                    size="sm"
                                    variant="flat"
                                  >
                                    {bid.status}
                                  </Chip>
                                </TableCell>
                                <TableCell>
                                  {bid.bondAmount
                                    ? `${bid.bondAmount} ETH`
                                    : "-"}
                                </TableCell>
                                <TableCell>{bid.placedAt}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button
                                      as={Link}
                                      href={`/hybrid/${bid.auctionId}`}
                                      size="sm"
                                      variant="light"
                                    >
                                      View
                                    </Button>
                                    {bid.status === "pending" &&
                                      bid.bondAmount && (
                                        <Button
                                          color="danger"
                                          size="sm"
                                          variant="light"
                                        >
                                          Cancel
                                        </Button>
                                      )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </Tab>

              <Tab key="rewards" title="Rewards">
                <div className="space-y-6">
                  <Card className="p-4">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Loyalty Rewards</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            1,250
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Points Earned
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            0.00452 ETH
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Rewards Claimed
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            2
                          </p>
                          <p className="text-sm text-gray-600">
                            Successful Auctions
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          Loyalty NFT Status
                        </h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-200">
                              Current Tier: <strong>Silver Bidder</strong>
                            </p>
                            <p className="text-xs text-gray-300">
                              Next tier at 2,000 points
                            </p>
                          </div>
                          <Progress
                            className="w-32"
                            color="warning"
                            value={(1250 / 2000) * 100}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="p-4">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Recent Rewards</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border border-white/30 rounded-lg p-4">
                          <div>
                            <p className="font-semibold">Auction #3 Reward</p>
                            <p className="text-sm text-gray-300">
                              Early bidder bonus
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              +0.0125 ETH
                            </p>
                            <p className="text-xs text-gray-300">+150 points</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 border border-white/30 rounded-lg p-4">
                          <div>
                            <p className="font-semibold">Auction #1 Reward</p>
                            <p className="text-sm text-gray-300">
                              Participation reward
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              +0.0083 ETH
                            </p>
                            <p className="text-xs text-gray-300">+100 points</p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          )}
        </motion.div>
      </div>
    </DefaultLayout>
  );
}
