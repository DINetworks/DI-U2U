import { createConfig, http } from "wagmi";
import { injected, metaMask, walletConnect } from "@wagmi/connectors";
import {mainnet, bsc, optimism, base, polygon, arbitrum, avalanche} from "viem/chains"

// export const domaChain = {
//   id: 97476,
//   name: "Doma Testnet",
//   nativeCurrency: {
//     decimals: 18,
//     name: "DOMA",
//     symbol: "DOMA",
//   },
//   rpcUrls: {
//     default: {
//       http: ["https://rpc-testnet.doma.xyz"],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "Explorer",
//       url:
//         process.env.NEXT_PUBLIC_DOMA_BLOCK_EXPLORER ||
//         "https://explorer-testnet.doma.xyz",
//     },
//   },
// };

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

export const config = createConfig({
  chains: [mainnet, bsc, optimism, base, polygon, arbitrum, avalanche],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "170f854b82b100289c65898d1e8a7cb6" }),
  ],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
    ),
    [bsc.id]: http(),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    ),
    [optimism.id]: http(
      `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    ),
    [arbitrum.id]: http(
      `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    ),
    [avalanche.id]: http(
      `https://avalanche-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
    ),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`)
  },
});

export const DOMA_CHAINID = 97476;

export const CONTRACT_ADDRESSES = {
  HYBRID_DUTCH_AUCTION: "0xE680A0F580f742a536B33C142757b4C8BE5CfB40",
  AUCTION_BETTING: "0x5A11663fc4cBfa62E01C3bbCfDb10f37549B38D2",
  LOYALTY_NFT: "0x04B36cADFD85F2561c0e8A676E0aCe5cBA8c7485",
  OWNERSHIP_TOKEN: "0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f",
  CREDIT_VAULT: "0xA055FaD49eA2EFeF1ecB8bffeC6e160689330026",
  METATX_GATEWAY: "0xbee9591415128F7d52279C8df327614d8fD8a9b2"
};
