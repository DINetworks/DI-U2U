import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";

interface GasCreditCardProps {
  credit: string;
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export default function GasCreditCard({
  credit,
  onDeposit,
  onWithdraw
}: GasCreditCardProps) {
  return (
    <Card className="bg-[#ffffff]/20 backdrop-blur-sm p-6">
      <CardBody className="text-center">
        <div className="text-sm text-gray-400 mb-2">Current Gas Credit</div>
        <div className="text-3xl font-bold text-white">{credit}</div>
      </CardBody>
      <CardFooter className="gap-2">
        <Button color="success" size="sm" variant="flat" fullWidth onPress={onDeposit}>
          Deposit
        </Button>
        <Button color="warning" size="sm" variant="flat" fullWidth onPress={onWithdraw}>
          Withdraw
        </Button>
      </CardFooter>
    </Card>
  );
}