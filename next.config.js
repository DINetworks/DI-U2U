/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      'github.com',
      'raw.githubusercontent.com',
      'assets.coingecko.com',
      'tokens.1inch.io',
      'token-icons.s3.amazonaws.com',
      'logos.covalenthq.com',
      'static.debank.com',
      'cdn.jsdelivr.net',
      'ipfs.io',
      'gateway.ipfs.io',
      'cloudflare-ipfs.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
