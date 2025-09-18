import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";
import { TwitterIcon, GithubIcon, DiscordIcon } from "@/components/icons";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-divider bg-background/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DI Networks
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Next-generation cross-chain DeFi infrastructure featuring gasless transactions,
              programmable bridges, and DEX aggregation across 30+ exchanges.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                isExternal
                className="text-gray-500 hover:text-gray-700"
                href={siteConfig.links.twitter}
              >
                <TwitterIcon size={20} />
              </Link>
              <Link
                isExternal
                className="text-gray-500 hover:text-gray-700"
                href={siteConfig.links.discord}
              >
                <DiscordIcon size={20} />
              </Link>
              <Link
                isExternal
                className="text-gray-500 hover:text-gray-700"
                href={siteConfig.links.github}
              >
                <GithubIcon size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-400 hover:text-gray-900"
                  href="/metatx"
                >
                  Gasless Transactions
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-gray-900"
                  href="/bridge"
                >
                  IU2U Bridge
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-gray-900"
                  href="/swap"
                >
                  Cross-Chain Swap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-400 hover:text-gray-900"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  isExternal
                  className="text-gray-400 hover:text-gray-900"
                  href={siteConfig.links.github}
                >
                  GitHub
                </Link>
              </li>
              <li>
                <span className="text-gray-400">Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-divider mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 DI Networks.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
