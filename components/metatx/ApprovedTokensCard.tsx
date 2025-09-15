import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

interface ApprovedTokensCardProps {
  approvedTokens: string[];
  onApprove?: () => void;
  onDisapprove?: () => void;
}

export default function ApprovedTokensCard({
  approvedTokens,
  onApprove,
  onDisapprove
}: ApprovedTokensCardProps) {
  return (
    <Card className="bg-[#ffffff]/20 backdrop-blur-sm p-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-center">Approved Tokens</h3>
          <p className="text-sm text-gray-400">Tokens approved for gasless transactions</p>
        </div>
      </CardHeader>
      <CardBody>
        {approvedTokens.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {approvedTokens
              .filter((token) => token && typeof token === 'string')
              .map((token, index) => (
                <Chip key={index} color="success" variant="flat" size="sm">
                  {token.toUpperCase()}
                </Chip>
              ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mb-4">
            No tokens approved yet
          </div>
        )}
      </CardBody>
      <CardFooter className="gap-2">
        <Button color="success" size="sm" variant="flat" fullWidth onPress={onApprove}>
          Approve Token
        </Button>
        <Button color="warning" size="sm" variant="flat" fullWidth onPress={onDisapprove}>
          Disapprove Token
        </Button>
      </CardFooter>
    </Card>
  );
}