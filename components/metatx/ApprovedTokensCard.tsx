import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";

import { normalizeTokenLogoURI } from "@/utils/token";

interface Token {
  address: string;
  chainId: string;
  coingeckoId: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

interface ApprovedTokensCardProps {
  approvedTokens: Token[];
  onApprove?: () => void;
  onDisapprove?: () => void;
}

export default function ApprovedTokensCard({
  approvedTokens,
  onApprove,
  onDisapprove,
}: ApprovedTokensCardProps) {
  return (
    <Card className="bg-[#ffffff]/20 backdrop-blur-sm p-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col w-full gap-2">
          <h3 className="text-xl font-bold text-center">Approved Tokens</h3>
          <p className="text-sm text-gray-400 text-center">
            Tokens approved for gasless transactions
          </p>
        </div>
      </CardHeader>
      <CardBody>
        {approvedTokens.length > 0 ? (
          <div className="space-y-3 mb-4">
            {approvedTokens.map((token) => (
              <div
                key={token.address}
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <Image
                  alt={token.symbol}
                  className="rounded-full"
                  height={32}
                  src={normalizeTokenLogoURI(token.logoURI)}
                  width={32}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{token.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {token.symbol.toUpperCase()}
                  </div>
                </div>
                <Chip color="success" size="sm" variant="flat">
                  Approved
                </Chip>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mb-4">
            No tokens approved yet
          </div>
        )}
      </CardBody>
      <CardFooter className="gap-2">
        <Button
          fullWidth
          color="success"
          size="sm"
          variant="flat"
          onPress={onApprove}
        >
          Approve Token
        </Button>
        <Button
          fullWidth
          color="warning"
          size="sm"
          variant="flat"
          onPress={onDisapprove}
        >
          Disapprove Token
        </Button>
      </CardFooter>
    </Card>
  );
}
