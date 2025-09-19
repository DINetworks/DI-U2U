import { Card, CardBody } from "@heroui/card";

import { CONTRACT_ADDRESSES } from "@/config/web3";
import Address from "@/components/base/Address";

export default function ContractsInfo() {
  return (
    <Card className="bg-[#ffffff]/20 backdrop-blur-sm p-6">
      <CardBody className="text-center">
        <div className="text-md text-gray-400 mb-2">Contracts Information</div>
        <div className="flex items-center justify-between gap-2 text-sm font-bold text-gray-300">
          <div>MetaTx Gateway: </div>
          <Address address={CONTRACT_ADDRESSES.METATX_GATEWAY} />
        </div>
        <div className="flex items-center justify-between gap-2 text-sm font-bold text-gray-300">
          <div>Credit Vault: </div>
          <Address address={CONTRACT_ADDRESSES.CREDIT_VAULT} />
        </div>
      </CardBody>
    </Card>
  );
}
