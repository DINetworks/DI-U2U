import { CONTRACT_ADDRESSES } from "@/config/web3";

export const nativeEvmTokenAddress =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const shortenAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const normalizeTokenLogoURI = (uri: string): string => {
  if (!uri) return "/images/token-placeholder.png";

  // Convert GitHub URLs to raw.githubusercontent.com
  if (uri.includes("github.com") && !uri.includes("raw.githubusercontent.com")) {
    // Handle different GitHub URL patterns
    const githubRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(?:blob|tree)\/([^\/]+)\/(.+)/;
    const match = uri.match(githubRegex);

    if (match) {
      const [, owner, repo, branch, path] = match;
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    }
  }

  return uri;
};

export const linkToBlockExplorer = (address: string) => {
  return `${process.env.NEXT_PUBLIC_DOMA_BLOCK_EXPLORER}/address/${address}`;
};

export const linkToDomainOnBlockExplorer = (tokenId: string) => {
  return `${process.env.NEXT_PUBLIC_DOMA_BLOCK_EXPLORER}/token/${CONTRACT_ADDRESSES.OWNERSHIP_TOKEN}/instance/${tokenId}`;
};

export const openLinkToDomainExplorer = (tokenId: string) => {
  window.open(linkToDomainOnBlockExplorer(tokenId), "_blank");
};

export const sortAllTokens = (tokenA: any, tokenB: any) => {
  const chainIdMcapPriority = [
    '1',
    '56',
    '43114',
    '137',
    '314',
    '42161',
    '10',
    '250' // Fantom
  ]

  const getChainIdPriority = (chainId: string) => {
    const index = chainIdMcapPriority.indexOf(chainId)
    return index === -1 ? Number.MAX_SAFE_INTEGER : index
  }

  const isNative = (token: any) => {
    return token.address.toLowerCase() === nativeEvmTokenAddress
  }

  if (isNative(tokenA) && isNative(tokenB)) {
    return (
      getChainIdPriority(tokenA.chainId) - getChainIdPriority(tokenB.chainId)
    )
  }

  if (isNative(tokenA)) {
    return -1
  }

  if (isNative(tokenB)) {
    return 1
  }

  const tokenPriority = ['USDC', 'USDT', 'axlUSDC']
  const indexA = tokenPriority.indexOf(tokenA.symbol)
  const indexB = tokenPriority.indexOf(tokenB.symbol)

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB
  }

  if (indexA !== -1) {
    return -1
  }

  if (indexB !== -1) {
    return 1
  }
  
  return 0
}

export const timeLeft = (endTime: number) => {
  const remaining = endTime - Math.floor(Date.now() / 1000);

  if (remaining <= 0) return "0h 0m";

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);

  return `${h}h ${m}m`;
};
