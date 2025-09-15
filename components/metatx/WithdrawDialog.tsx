import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Slider,
} from "@heroui/react";

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (creditAmount: bigint) => Promise<void>;
  isLoading: boolean;
  credit: string;
}

export default function WithdrawDialog({
  isOpen,
  onClose,
  onWithdraw,
  isLoading,
  credit,
}: WithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState<number>(20);

  // Use refs to track update sources and prevent circular updates
  const isUpdatingFromSlider = useRef(false);
  const isUpdatingFromInput = useRef(false);

  // Calculate amount based on slider percentage and credit balance
  useEffect(() => {
    if (credit && !isUpdatingFromInput.current) {
      isUpdatingFromSlider.current = true;
      const calculatedAmount = (parseFloat(credit) * sliderValue) / 100;
      setAmount(calculatedAmount.toFixed(6));
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromSlider.current = false;
      }, 10);
    }
  }, [sliderValue, credit]);

  // Update slider when amount is manually changed
  useEffect(() => {
    if (credit && amount && !isUpdatingFromSlider.current) {
      isUpdatingFromInput.current = true;
      const percentage = (parseFloat(amount) / parseFloat(credit)) * 100;
      if (percentage >= 0 && percentage <= 100) {
        setSliderValue(Math.round(percentage));
      }
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromInput.current = false;
      }, 10);
    }
  }, [amount, credit]);

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSliderValue(20);
      setAmount("");
    }
  }, [isOpen]);

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      await onWithdraw(BigInt(amount));
      setAmount("");
      onClose();
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const handleMaxWithdraw = () => {
    setAmount(credit);
    setSliderValue(100);
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="md" className="p-4">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Withdraw Gas Credit</h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <label id="withdraw-amount-label" className="block text-sm font-medium mb-2">Amount to Withdraw</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  isUpdatingFromSlider.current = false;
                  setAmount(e.target.value);
                }}
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">U2U</span>
                  </div>
                }
                className="flex-1"
                aria-labelledby="withdraw-amount-label"
              />
              <Button
                size="sm"
                variant="flat"
                onPress={handleMaxWithdraw}
                className="px-3"
              >
                Max
              </Button>
            </div>
            <Slider
              className="max-w-md mt-3"
              color="foreground"
              value={sliderValue}
              onChange={(value) => {
                isUpdatingFromInput.current = false;
                setSliderValue(value as number);
              }}
              label={`${sliderValue}% of credit`}
              marks={[
                {
                  value: 20,
                  label: "20%",
                },
                {
                  value: 50,
                  label: "50%",
                },
                {
                  value: 80,
                  label: "80%",
                },
              ]}
              size="sm"
              step={1}
              minValue={0}
              maxValue={100}
            />
            <div className="text-xs text-gray-400 mt-1">
              Available credit: {credit} U2U
            </div>
          </div>

          <div className="text-sm text-gray-400">
            💡 Available to withdraw: {credit} U2U
          </div>

          <div className="text-sm text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
            ⚠️ Withdrawing gas credits will reduce your available balance for gasless transactions.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="warning"
            onPress={handleWithdraw}
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(credit)}
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}