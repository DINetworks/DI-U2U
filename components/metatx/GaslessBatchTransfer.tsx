import { useState } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

const tokens = [
  { key: "eth", label: "ETH" },
  { key: "usdc", label: "USDC" },
  { key: "usdt", label: "USDT" },
  { key: "dai", label: "DAI" },
];

interface Transfer {
  id: number;
  token: string;
  receiver: string;
  amount: string;
}

interface GaslessBatchTransferProps {
  transfers: Transfer[];
  credit: string;
  onAddTransfer: () => void;
  onRemoveTransfer: (id: number) => void;
  onUpdateTransfer: (id: number, field: string, value: string) => void;
  onStartTransaction: () => void;
}

export default function GaslessBatchTransfer({
  transfers,
  credit,
  onAddTransfer,
  onRemoveTransfer,
  onUpdateTransfer,
  onStartTransaction,
}: GaslessBatchTransferProps) {
  return (
    <Card className="bg-[#ffffff]/20 text-white backdrop-blur-sm p-8">
      <CardHeader className="pb-4">
        <div>
          <h3 className="text-2xl font-bold">Gasless Batch Transfer</h3>
          <p className="text-gray-300">Send multiple transfers at once without worrying about gas fees</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {transfers.map((transfer, index) => (
            <div key={transfer.id} className="relative">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label id={`token-label-${transfer.id}`} className="block text-sm font-medium mb-2">Token</label>
                  <Select
                    placeholder="Select token"
                    selectedKeys={transfer.token ? new Set([transfer.token]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      onUpdateTransfer(transfer.id, 'token', selected || '');
                    }}
                    className="w-full"
                    aria-labelledby={`token-label-${transfer.id}`}
                  >
                    {tokens.map((token) => (
                      <SelectItem key={token.key}>
                        {token.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex-1">
                  <label id={`receiver-label-${transfer.id}`} className="block text-sm font-medium mb-2">Receiver Address</label>
                  <Input
                    placeholder="0x..."
                    value={transfer.receiver}
                    onChange={(e) => onUpdateTransfer(transfer.id, 'receiver', e.target.value)}
                    className="w-full"
                    aria-labelledby={`receiver-label-${transfer.id}`}
                  />
                </div>
                <div className="flex-1">
                  <label id={`amount-label-${transfer.id}`} className="block text-sm font-medium mb-2">Amount</label>
                  <Input
                    placeholder="0.00"
                    type="number"
                    value={transfer.amount}
                    onChange={(e) => onUpdateTransfer(transfer.id, 'amount', e.target.value)}
                    className="w-full"
                    aria-labelledby={`amount-label-${transfer.id}`}
                  />
                </div>
                <div className="flex-shrink-0 self-end">
                  {transfers.length > 1 && (
                    <Button
                      isIconOnly
                      color="warning"
                      variant="flat"
                      size="sm"
                      onPress={() => onRemoveTransfer(transfer.id)}
                      className="rounded-full min-w-unit-10 w-10 h-10"
                    >
                      -
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <Button
              color="primary"
              variant="flat"
              onPress={onAddTransfer}
              startContent={<span>+</span>}
            >
              Add More
            </Button>

            <Button
              className="font-semibold"
              color="success"
              onPress={onStartTransaction}
              disabled={parseFloat(credit) <= 0 || transfers.some(t => !t.token || !t.receiver || !t.amount)}
            >
              Review Transfer
            </Button>
          </div>

          {parseFloat(credit) <= 0 && (
            <div className="text-sm text-yellow-400 text-center">
              ⚠️ Please deposit U2U first to enable gasless transactions
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
