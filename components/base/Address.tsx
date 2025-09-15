import { linkToBlockExplorer, shortenAddress } from "@/utils/token"
import { Link } from "@heroui/react"

interface AddressProps {
  address: string;
  chainId?: number;
}

const Address = ({address, chainId}: AddressProps) => {

    return (
        <Link
            isExternal
            showAnchorIcon
            color="success"
            href={linkToBlockExplorer(address)}
        >
            {shortenAddress(address)}
        </Link>
    )
}

export default Address