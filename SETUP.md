# DomaAuction Frontend Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Web3**
   - Update contract addresses in `config/web3.ts`
   - Set your WalletConnect project ID (optional)

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:3000`
   - Connect your wallet to Doma testnet

## Contract Deployment

Before using the frontend, deploy the smart contracts:

1. **Deploy HybridDutchAuction Contract**
   ```bash
   # In your contracts directory
   npx hardhat run scripts/deploy.js --network doma
   ```

2. **Update Contract Addresses**
   - Copy deployed contract addresses
   - Update `CONTRACT_ADDRESSES` in `config/web3.ts`

## Wallet Setup

1. **Add Doma Testnet to MetaMask**
   - Network Name: Doma Testnet
   - RPC URL: https://rpc-testnet.doma.xyz
   - Chain ID: 3043
   - Currency Symbol: DOMA

2. **Get Test Tokens**
   - Use Doma testnet faucet to get DOMA tokens
   - Ensure you have domain NFTs to auction

## Features Available

### For Sellers
- ✅ Create batch Dutch auctions
- ✅ Set reward budgets (0-5%)
- ✅ Enable reverse royalty engine
- ✅ Monitor auction progress
- ✅ View bidder activity

### For Buyers
- ✅ Browse active auctions
- ✅ Place soft bids (auto-convert)
- ✅ Place hard bids (immediate)
- ✅ Fractional ownership (1-100%)
- ✅ Track bid status
- ✅ Earn loyalty rewards

### Advanced Features
- ✅ Real-time price updates
- ✅ Gamified bidding system
- ✅ Dynamic royalty calculation
- ✅ Bond system (0.2% spam prevention)
- ✅ Loyalty NFT rewards
- ✅ Pro-rata allocation

## Architecture

```
├── pages/
│   ├── index.tsx           # Landing page
│   ├── auctions/
│   │   ├── index.tsx       # Auction listings
│   │   └── [id].tsx        # Auction details & bidding
│   ├── create.tsx          # Create new auction
│   └── my-auctions.tsx     # User dashboard
├── hooks/
│   ├── useWeb3.ts          # Wallet connection
│   └── useAuction.ts       # Contract interactions
├── components/
│   ├── wallet-connect.tsx  # Wallet UI component
│   └── navbar.tsx          # Navigation
└── config/
    └── web3.ts             # Blockchain configuration
```

## Smart Contract Integration

The frontend integrates with three main contracts:

1. **HybridDutchAuction.sol** - Main auction logic
2. **LoyaltyNFT.sol** - Gamification rewards  
3. **IOwnershipToken.sol** - Domain NFT interface

Key functions used:
- `createBatchAuction()` - Create new auctions
- `placeSoftBid()` - Intent-based bidding
- `placeHardBid()` - Immediate purchase
- `getCurrentPrice()` - Real-time pricing
- `processConversions()` - Execute soft bids

## Troubleshooting

**Wallet Connection Issues:**
- Ensure MetaMask is installed
- Check network configuration
- Verify you're on Doma testnet

**Transaction Failures:**
- Check gas limits
- Ensure sufficient DOMA balance
- Verify contract addresses

**Missing Auctions:**
- Confirm contracts are deployed
- Check if auctions exist on-chain
- Verify network connection

## Next Steps

1. Deploy contracts to Doma testnet
2. Update contract addresses in config
3. Test with real domain NFTs
4. Customize UI/branding as needed
5. Add additional features (analytics, etc.)

## Support

For issues or questions:
- Check contract deployment logs
- Verify wallet configuration
- Review browser console for errors
- Ensure all dependencies are installed