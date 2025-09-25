import { Link } from "@heroui/react";

import { getBlockExplorerUrl, shortenAddress } from "@/utils/token";
import { Chain } from "viem";
import { u2uTestnet } from "@/config/web3";

interface AddressProps {
  address: string;
  chain?: Chain
}

const Address = ({ address, chain = u2uTestnet }: AddressProps) => {
  return (
    <Link
      isExternal
      showAnchorIcon
      color="success"
      href={getBlockExplorerUrl(address, chain)}
    >
      {shortenAddress(address)}
    </Link>
  );
};

export default Address;
