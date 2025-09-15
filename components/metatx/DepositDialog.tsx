import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Slider,
} from "@heroui/react";
import { Address } from "viem";

interface DepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (tokenAddress: Address, amount: bigint) => Promise<void>;
  isLoading: boolean;
}

const tokens = [
  { key: "u2u", label: "U2U", address: "0x..." }, // Replace with actual U2U token address
  { key: "usdc", label: "USDC", address: "0x..." },
  { key: "usdt", label: "USDT", address: "0x..." },
];

export default function DepositDialog({
  isOpen,
  onClose,
  onDeposit,
  isLoading,
}: DepositDialogProps) {
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState<number>(20);
  const [tokenBalance, setTokenBalance] = useState<string>("1000"); // Mock balance - replace with actual balance fetching

  // Use refs to track update sources and prevent circular updates
  const isUpdatingFromSlider = useRef(false);
  const isUpdatingFromInput = useRef(false);

  // Calculate amount based on slider percentage and token balance
  useEffect(() => {
    if (selectedToken && tokenBalance && !isUpdatingFromInput.current) {
      isUpdatingFromSlider.current = true;
      const calculatedAmount = (parseFloat(tokenBalance) * sliderValue) / 100;
      setAmount(calculatedAmount.toFixed(6));
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromSlider.current = false;
      }, 10);
    }
  }, [sliderValue, selectedToken, tokenBalance]);

  // Update slider when amount is manually changed
  useEffect(() => {
    if (selectedToken && tokenBalance && amount && !isUpdatingFromSlider.current) {
      isUpdatingFromInput.current = true;
      const percentage = (parseFloat(amount) / parseFloat(tokenBalance)) * 100;
      if (percentage >= 0 && percentage <= 100) {
        setSliderValue(Math.round(percentage));
      }
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingFromInput.current = false;
      }, 10);
    }
  }, [amount, selectedToken, tokenBalance]);

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSliderValue(20);
      setAmount("");
      setSelectedToken("");
    }
  }, [isOpen]);

  // Update token balance when token is selected
  useEffect(() => {
    if (selectedToken) {
      // Mock balance fetching - replace with actual balance fetching logic
      const mockBalances = {
        u2u: "1500.50",
        usdc: "250.75",
        usdt: "180.25"
      };
      setTokenBalance(mockBalances[selectedToken as keyof typeof mockBalances] || "0");
    }
  }, [selectedToken]);

  const handleDeposit = async () => {
    if (!selectedToken || !amount || parseFloat(amount) <= 0) return;

    const token = tokens.find(t => t.key === selectedToken);
    if (!token) return;

    try {
      await onDeposit(token.address as Address, BigInt(amount) * BigInt(10**18)); // Assuming 18 decimals
      setAmount("");
      setSelectedToken("");
      onClose();
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="md" className="p-4">
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-bold">Deposit U2U for Gas Credit</h3>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <label id="deposit-token-label" className="block text-sm font-medium mb-2">Select Token</label>
            <Select
              placeholder="Choose token to deposit"
              selectedKeys={selectedToken ? new Set([selectedToken]) : new Set()}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedToken(selected || "");
              }}
              aria-labelledby="deposit-token-label"
            >
              {tokens.map((token) => (
                <SelectItem key={token.key}>
                  {token.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <label id="deposit-amount-label" className="block text-sm font-medium mb-2">Amount</label>
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
                  <span className="text-default-400 text-small">
                    {selectedToken ? tokens.find(t => t.key === selectedToken)?.label : ""}
                  </span>
                </div>
              }
              aria-labelledby="deposit-amount-label"
            />
            <Slider
              className="max-w-md mt-3"
              color="foreground"
              value={sliderValue}
              onChange={(value) => {
                isUpdatingFromInput.current = false;
                setSliderValue(value as number);
              }}
              label={`${sliderValue}% of balance`}
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
              Balance: {tokenBalance} {selectedToken ? tokens.find(t => t.key === selectedToken)?.label : ""}
            </div>
          </div>

          <div className="text-sm text-gray-400">
            💡 Deposit tokens to build up your gas credit balance for gasless transactions.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            onPress={handleDeposit}
            isLoading={isLoading}
            disabled={!selectedToken || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? "Depositing..." : "Deposit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}