import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";

interface GasCreditCardProps {
  credit: string;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  onShowHistory: () => void;
}

export default function GasCreditCard({
  credit,
  onDeposit,
  onWithdraw,
  onShowHistory
}: GasCreditCardProps) {

  return (
    <>
      <Card className="bg-[#ffffff]/20 backdrop-blur-sm p-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-400">Current Gas Credit</div>
            <button
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
              title="View credit history"
              onClick={onShowHistory}
            >
              <svg
                className="w-4 h-4 text-white group-hover:text-blue-300 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardBody className="text-center">
          <div className="text-3xl font-bold text-white">{credit}</div>
        </CardBody>
        <CardFooter className="gap-2">
          <Button
            fullWidth
            color="success"
            size="sm"
            variant="flat"
            onPress={onDeposit}
          >
            Deposit
          </Button>
          <Button
            fullWidth
            color="warning"
            size="sm"
            variant="flat"
            onPress={onWithdraw}
          >
            Withdraw
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
