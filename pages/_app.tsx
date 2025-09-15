import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import { config } from "@/config/web3";
import { WalletProvider } from "@/contexts/WalletContext";
import "@/styles/globals.css";
import "@/styles/main.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <WalletProvider>
              <Component {...pageProps} />
              <Toaster position="top-right" />
            </WalletProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
