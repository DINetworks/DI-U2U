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
// export const u2uTestnet = {
//   id: 2484,
//   name: "U2U Nebulas Testnet",
//   nativeCurrency: {
//     decimals: 18,
//     name: "U2U",
//     symbol: "U2U",
//   },
//   rpcUrls: {
//     default: {
//       http: ["https://rpc-nebulas-testnet.uniultra.xyz/"],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: "U2U Scan",
//       url: "https://testnet.u2uscan.xyz",
//     },
//   },
//   testnet: true,
// };

// U2U Nebulas Testnet
export const u2u = {
  id: 39,
  name: "U2U Solaris Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "U2U",
    symbol: "U2U",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-mainnet.u2u.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "U2U Scan",
      url: "https://u2uscan.xyz",
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
    // u2uTestnet,
    u2u,
  ],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "170f854b82b100289c65898d1e8a7cb6" }),
  ],
  transports: {
    [mainnet.id]: http(
      `https://mainnet.gateway.tenderly.co`,
    ),
    [bsc.id]: http("https://bsc-dataseed.binance.org/"),
    [polygon.id]: http(
      `https://polygon-rpc.com/`,
    ),
    [optimism.id]: http(
      `https://optimism-rpc.publicnode.com/`,
    ),
    [arbitrum.id]: http(
      `https://arbitrum-one-rpc.publicnode.com/`,
    ),
    [avalanche.id]: http(
      `https://avalanche-c-chain-rpc.publicnode.com/`,
    ),
    [base.id]: http(`https://mainnet.base.org/`),
    // [u2uTestnet.id]: http("https://rpc-nebulas-testnet.uniultra.xyz/"),
    [u2u.id]: http("https://rpc-mainnet.u2u.xyz"),
  },
});

export const CONTRACT_ADDRESSES = {
  CREDIT_VAULT: "0xD7E3c62c40ff6D4ef591669880783258De5fb614",
  METATX_GATEWAY: "0xbee9591415128F7d52279C8df327614d8fD8a9b2",

  // IU2U Bridge Contracts
  IU2U_TOKEN: {
    [mainnet.id]: "0x9649a304bD0cd3c4dbe72116199990df06d87329",
    [polygon.id]: "0x9649a304bD0cd3c4dbe72116199990df06d87329",
    [bsc.id]: "0x365235b4ea2F5439f27b10f746C52B0B47c33761",
    [base.id]: "0xF69C5FB9359a4641469cd457412C7086fd32041D",
    [optimism.id]: "0x5814C4a96532618c31deb231bFdEFE443f8474b8",
    [avalanche.id]: "0x9E5e98FFaD3F779Ed3459631694788E38B822261",
    [arbitrum.id]: "0x48A4C62Af369D37c7411AcB2aF59c87E0A7a0983",
    [u2u.id]: "0xA3A350214b699578bF9df1Eeb743ab7C139119d6",
    // [u2uTestnet.id]: "0x2551f9E86a20bf4627332A053BEE14DA623d1007",
  },
  IU2U_GATEWAY: {
    [mainnet.id]: "0xe5DE1F17974B1758703C4bF9a8885F7e24983bb7",
    [polygon.id]: "0xe5DE1F17974B1758703C4bF9a8885F7e24983bb7",
    [bsc.id]: "0xe4A31447871c39eD854279acCEAeB023e79dDCC5",
    [base.id]: "0x9649a304bD0cd3c4dbe72116199990df06d87329",
    [optimism.id]: "0xeD93D637b13Ca7f61875BB31386E9a54Bab51C9B",
    [avalanche.id]: "0x2e33C951e4cdDbccB5945C9f32095FccD1171259",
    [arbitrum.id]: "0x9E5e98FFaD3F779Ed3459631694788E38B822261",
    [u2u.id]: "0x560d354E9f690f9749594840120B4b5903c20E07",
    // [u2uTestnet.id]: "0x7Ccba78c7224577DDDEa5B3302b81db7915e5377",
  },
};

export const ACTIVE_CHAINID = u2u.id;

export const CREDIT_TOKENS = [
  {
    address: CONTRACT_ADDRESSES.IU2U_TOKEN[u2u.id],
    chainId: u2u.id.toString(),
    coingeckoId: "u2u-network",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/32963/standard/Logo_U2U.jpeg",
    name: "Interoperable U2U",
    symbol: "IU2U",
  },
];
