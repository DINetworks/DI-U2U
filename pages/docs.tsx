import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const docSections = [
  {
    id: "overview",
    title: "📖 Overview",
    content: `
# DomaAuction Protocol

DomaAuction is a next-generation hybrid Dutch auction system designed specifically for domain NFTs. It combines traditional Dutch auction mechanics with innovative features like batch auctions, gamified bidding, and dynamic royalties.

## Key Features

- **Batch Dutch Auctions**: Auction multiple domain NFTs as a portfolio
- **Fractional Ownership**: Buy portions of bundles (10%, 25%, etc.)
- **Gamified Bidding**: Soft bids with loyalty rewards
- **Dynamic Royalties**: Reverse royalty engine that increases over time
    `,
  },
  {
    id: "getting-started",
    title: "🚀 Getting Started",
    content: `
# Getting Started

## Prerequisites

- MetaMask or compatible Web3 wallet
- DOMA testnet tokens
- Domain NFTs to auction

## Quick Start

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Switch Network**: Ensure you're on Doma testnet (Chain ID: 97476)
3. **Create Auction**: Navigate to "Create Auction" and set up your first auction
4. **Place Bids**: Browse active auctions and place soft or hard bids

## Network Configuration

\`\`\`javascript
{
  chainId: 97476,
  name: "Doma Testnet",
  rpcUrl: "https://rpc-testnet.doma.xyz",
  blockExplorer: "https://explorer-testnet.doma.xyz"
}
\`\`\`
    `,
  },
  {
    id: "auctions",
    title: "🏷️ Creating Auctions",
    content: `
# Creating Auctions

## Auction Types

### Batch Dutch Auction
Auction multiple domain NFTs as a single bundle with linear price decay.

### Parameters

- **Start Price**: Initial price per token
- **Reserve Price**: Minimum price floor
- **Price Decrement**: Reduction per block
- **Duration**: Auction length in blocks

## Advanced Features

### Loyalty Rewards
- Allocate 0-5% of sale proceeds as rewards
- Early bidders get higher multipliers
- Only distributed on successful auctions

### Reverse Royalty Engine
- Starts at 0% and increases per block
- Creates urgency for buyers
- Optional for secondary sales

## Example

\`\`\`solidity
createBatchAuction(
  ownershipToken,
  [1,2,3,4,5],     // Token IDs
  1000e18,         // 1000 DOMA start price
  700e18,          // 700 DOMA reserve
  1e18,            // 1 DOMA per block decrement
  300,             // 300 blocks duration
  100,             // 1% reward budget
  0                // No reverse royalty
)
\`\`\`
    `,
  },
  {
    id: "bidding",
    title: "🎯 Bidding System",
    content: `
# Bidding System

## Bid Types

### Soft Bids
- **Intent-based**: Set a threshold price for auto-conversion
- **Bond Required**: 0.2% of intended spend (refundable)
- **Loyalty Points**: Earn rewards for early participation
- **Auto-Convert**: Executes when price drops to threshold

### Hard Bids
- **Immediate**: Purchase at current price
- **No Bond**: Direct payment required
- **Instant Settlement**: Tokens transferred immediately

## Fractional Ownership

Purchase any percentage of a bundle:
- Minimum: 1% of bundle
- Maximum: 100% of bundle
- Pro-rata distribution if over-subscribed

## Bond System

\`\`\`javascript
bondAmount = intendedSpend * 0.002 // 0.2%
\`\`\`

Bonds are:
- Automatically refunded after auction
- Used to prevent spam bidding
- Returned even if bid doesn't convert
    `,
  },
  {
    id: "smart-contracts",
    title: "📋 Smart Contracts",
    content: `
# Smart Contracts

## Core Contracts

### HybridDutchAuction.sol
Main auction logic and state management.

**Key Functions:**
- \`createBatchAuction()\`: Create new auction
- \`placeSoftBid()\`: Place intent-based bid
- \`placeHardBid()\`: Immediate purchase
- \`processConversions()\`: Convert eligible soft bids

### LoyaltyNFT.sol
Gamification and reward distribution.

### IOwnershipToken.sol
Interface for Doma domain NFTs.

## Contract Addresses

### Doma Testnet
- **HybridDutchAuction**: \`0x...\`
- **OwnershipToken**: \`0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f\`
- **LoyaltyNFT**: \`0x...\`

## Events

\`\`\`solidity
event AuctionCreated(uint256 indexed auctionId, address seller, uint256 startPrice, uint256 reservePrice, bool hasReverseRoyalty);
event SoftBidPlaced(uint256 indexed auctionId, address bidder, uint256 threshold, uint256 count, uint256 bond);
event SoftBidConverted(uint256 indexed auctionId, address bidder, uint256 price, uint256 count);
event AuctionCleared(uint256 indexed auctionId, uint256 clearingPrice, uint256 totalRewards, uint256 royaltyAmount);
\`\`\`
    `,
  },
  {
    id: "api",
    title: "🔌 API Reference",
    content: `
# API Reference

## GraphQL Endpoint

\`\`\`
https://api.doma.xyz/graphql
\`\`\`

## Authentication

Include API key in headers:
\`\`\`javascript
headers: {
  'Api-Key': 'your-api-key'
}
\`\`\`

## Queries

### Get Owned Domains

\`\`\`graphql
query names($ownedBy: [AddressCAIP10!]) {
  names(ownedBy: $ownedBy) {
    items {
      name
      isFractionalized
      expiresAt
      claimedBy
      tokenizedAt
      tokens {
        explorerUrl
        tokenId
        ownerAddress
        type
      }
    }
  }
}
\`\`\`

### Variables

\`\`\`javascript
{
  "ownedBy": ["eip155:97476:0x..."]
}
\`\`\`

## Response Format

\`\`\`javascript
{
  "data": {
    "names": {
      "items": [
        {
          "name": "example.com",
          "isFractionalized": false,
          "expiresAt": "2026-09-04T02:12:48.000Z",
          "tokens": [
            {
              "tokenId": "123...",
              "ownerAddress": "eip155:97476:0x...",
              "type": "OWNERSHIP"
            }
          ]
        }
      ]
    }
  }
}
\`\`\`
    `,
  },
  {
    id: "examples",
    title: "💡 Examples",
    content: `
# Examples

## Example 1: Portfolio Auction

**Setup:**
- 100-domain bundle
- Start: 1,000 USDC per token
- Reserve: 700 USDC per token
- Reward budget: 1% of final sale

**Bidding Flow:**
1. Alice: Soft bid 10% at 900 USDC
2. Bob: Soft bid 5% at 860 USDC  
3. Carol: Soft bid 40% at 820 USDC
4. Dana: Soft bid 50% at 780 USDC

**Settlement:**
- Price drops to 780 USDC
- All bids convert (105% total)
- Pro-rata distribution
- Loyalty rewards distributed

## Example 2: Single Premium Domain

**Setup:**
- Single high-value domain
- Start: 100 ETH
- Reserve: 50 ETH
- First bid wins immediately

**Result:**
- Alice bids 85 ETH threshold
- When price hits 85 ETH, Alice wins
- Auction ends immediately
- Alice receives loyalty points

## Example 3: Reverse Royalty

**Setup:**
- 3 domains for resale
- No loyalty rewards
- 0.1% royalty increase per block

**Trade-off:**
- Wait for lower price = higher royalty
- Buy early = lower royalty
- Creates urgency for buyers

## Code Examples

### Creating Auction (Frontend)

\`\`\`javascript
const { createAuction } = useAuction()

await createAuction({
  tokenIds: [1, 2, 3, 4, 5],
  startPrice: "1000",
  reservePrice: "700", 
  priceDecrement: "1",
  duration: 300,
  rewardBudgetBps: 100,
  royaltyIncrement: 0
})
\`\`\`

### Placing Soft Bid

\`\`\`javascript
const { placeSoftBid } = useAuction()

await placeSoftBid(
  auctionId,
  "850", // threshold price
  10    // desired percentage
)
\`\`\`
    `,
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = docSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeContent = docSections.find(
    (section) => section.id === activeSection,
  );

  return (
    <DefaultLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className={title({ size: "sm" })}>Documentation</h2>
            <p className="text-gray-400 text-sm mt-2">
              Complete guide to DomaAuction protocol
            </p>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search docs..."
              size="sm"
              startContent={<span>🔍</span>}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <nav className="space-y-2">
            {filteredSections.map((section) => (
              <Button
                key={section.id}
                className="w-full justify-start h-auto p-3"
                color={activeSection === section.id ? "primary" : "default"}
                variant={activeSection === section.id ? "flat" : "light"}
                onPress={() => setActiveSection(section.id)}
              >
                <div className="text-left">
                  <div className="font-medium text-sm">{section.title}</div>
                </div>
              </Button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Chip color="success" size="sm" variant="dot">
                  Live
                </Chip>
                <span>Doma Testnet</span>
              </div>
              <div>Chain ID: 97476</div>
              <div>Version: 1.0.0</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <motion.div
              key={activeSection}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <CardBody>
                  <div className="prose prose-gray max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          activeContent?.content
                            .replace(
                              /^### (.*$)/gm,
                              '<h3 class="text-lg font-semibold mt-2">$1</h3>',
                            )
                            .replace(
                              /^## (.*$)/gm,
                              '<h2 class="text-xl font-semibold mt-3">$1</h2>',
                            )
                            .replace(
                              /^# (.*$)/gm,
                              '<h1 class="text-2xl font-bold mt-4">$1</h1>',
                            )
                            .replace(
                              /\*\*([^*]+)\*\*/g,
                              '<strong class="font-semibold">$1</strong>',
                            )
                            .replace(
                              /`([^`]+)`/g,
                              '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
                            )
                            .replace(
                              /```([\s\S]*?)```/g,
                              '<pre class="text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>',
                            ) || "",
                      }}
                      className="whitespace-pre-wrap leading-relaxed"
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
