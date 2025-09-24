import { createConfig } from "wagmi";
import { http } from "viem";
import { injected, metaMask, walletConnect } from "@wagmi/connectors";
import {
  mainnet,
  bsc,
  optimism,
  base,
  polygon,
  arbitrum,
  avalanche,
} from "viem/chains";

// U2U Nebulas Testnet
export const u2uTestnet = {
  id: 2484,
  name: "U2U Nebulas Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "U2U",
    symbol: "U2U",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-nebulas-testnet.uniultra.xyz/"],
    },
  },
  blockExplorers: {
    default: {
      name: "U2U Scan",
      url: "https://testnet.u2uscan.xyz",
    },
  },
  testnet: true,
};

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const config = createConfig({
  chains: [
    mainnet,
    bsc,
    optimism,
    base,
    polygon,
    arbitrum,
    avalanche,
    u2uTestnet,
  ],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "170f854b82b100289c65898d1e8a7cb6" }),
  ],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    ),
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    ),
    [optimism.id]: http(
      `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    ),
    [arbitrum.id]: http(
      `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    ),
    [avalanche.id]: http(
      `https://avalanche-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    ),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [u2uTestnet.id]: http("https://rpc-nebulas-testnet.uniultra.xyz/"),
  },
});


export const CONTRACT_ADDRESSES = {
  CREDIT_VAULT: "0x0f796dC6bD0fa676BF5CE02658Dab86E1Dc95EFc", // 0x3AA775651fad6271C870762F8A9069ff94E7B542
  METATX_GATEWAY: "0xbee9591415128F7d52279C8df327614d8fD8a9b2",

  // IU2U Bridge Contracts
  IU2U_TOKEN: {
    [mainnet.id]: "0x9649a304bD0cd3c4dbe72116199990df06d87329",
    [polygon.id]: "0x9649a304bD0cd3c4dbe72116199990df06d87329",
    [bsc.id]: "0x365235b4ea2F5439f27b10f746C52B0B47c33761",
    [base.id]: "0xF69C5FB9359a4641469cd457412C7086fd32041D",
    [u2uTestnet.id]: "0x2551f9E86a20bf4627332A053BEE14DA623d1007",
  },
  IU2U_GATEWAY: {
    [mainnet.id]: "0xe5DE1F17974B1758703C4bF9a8885F7e24983bb7",
    [polygon.id]: "0xe5DE1F17974B1758703C4bF9a8885F7e24983bb7",
    [bsc.id]: "0xe4A31447871c39eD854279acCEAeB023e79dDCC5",
    [base.id]: "0x9649a304bD0cd3c4dbe72116199990df06d87329",
    [u2uTestnet.id]: "0x7Ccba78c7224577DDDEa5B3302b81db7915e5377",
  },
};

export const ACTIVE_CHAINID = u2uTestnet.id

export const CREDIT_TOKENS = [
  {
    address: CONTRACT_ADDRESSES.IU2U_TOKEN[u2uTestnet.id],
    chainId: u2uTestnet.id.toString(),
    coingeckoId: 'u2u-network',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/32963/standard/Logo_U2U.jpeg',
    name: 'Interoperable U2U',
    symbol: 'IU2U'
  }
]
