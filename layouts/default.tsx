import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useRouter } from "next/router";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 h-screen">
        <img
          alt="Domain Auction Background"
          className="w-full h-full object-cover"
          src="/images/domain-auction.jpg"
        />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className={`absolute inset-0 ${isHome? 'bg-black/40' : 'bg-black/40'}`} />
      </div>
      <div className="relative flex flex-col h-screen">
        <Head />
        <Navbar />
        <main className="container mx-auto max-w-7xl px-6 flex-grow py-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
