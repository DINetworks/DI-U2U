import { Link } from "@heroui/react";

import { linkToBlockExplorer, shortenAddress } from "@/utils/token";

interface AddressProps {
  address: string;
}

const Address = ({ address }: AddressProps) => {
  return (
    <Link
      isExternal
      showAnchorIcon
      color="success"
      href={linkToBlockExplorer(address)}
    >
      {shortenAddress(address)}
    </Link>
  );
};

export default Address;
