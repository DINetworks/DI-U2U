import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

export function useWeb3() {
  const { address, chain, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const connectWallet = () => {
    const connector = connectors[0];

    if (connector) {
      connect({ connector });
    }
  };

  const formattedBalance = balance ? formatEther(balance.value) : "0";

  return {
    address,
    chain,
    isConnected: isClient && isConnected,
    balance: formattedBalance,
    connectWallet,
    disconnect,
    isClient,
  };
}
