import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

import { SwapTokenSelectorProps } from "@/types/swap";
import { normalizeTokenLogoURI } from "@/utils/token";

export default function SwapTokenSelector({
  token,
  onTokenSelect,
  tokens,
  label,
  disabled = false,
  balance,
}: SwapTokenSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        {balance && (
          <span className="text-xs text-gray-400">
            Balance: {parseFloat(balance).toFixed(6)}
          </span>
        )}
      </div>

      <Card className="bg-white/10 backdrop-blur-sm">
        <CardBody className="p-4">
          <div className="flex items-center gap-3">
            {/* Token Selector Button */}
            <Button
              className="min-w-[140px] h-12 bg-white/5 hover:bg-white/10"
              disabled={disabled}
              variant="flat"
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2">
                {token ? (
                  <>
                    <Image
                      alt={token.symbol}
                      className="rounded-full"
                      height={24}
                      src={normalizeTokenLogoURI(token.logoURI)}
                      width={24}
                    />
                    <div className="text-left">
                      <div className="font-semibold text-white">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-white">Select Token</div>
                )}
              </div>
            </Button>

            {/* Amount Input */}
            <div className="flex-1">
              <Input
                className="text-right"
                classNames={{
                  input:
                    "text-white text-right text-lg font-semibold bg-transparent",
                  inputWrapper: "bg-white/5 hover:bg-white/10 border-white/20",
                }}
                disabled={disabled}
                placeholder="0.00"
                size="lg"
                type="number"
              />
            </div>
          </div>

          {/* Token Dropdown */}
          {isDropdownOpen && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {tokens.map((t) => (
                  <button
                    key={t.address}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => {
                      onTokenSelect(t);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Image
                      alt={t.symbol}
                      className="rounded-full"
                      height={32}
                      src={normalizeTokenLogoURI(t.logoURI)}
                      width={32}
                    />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">{t.symbol}</div>
                      <div className="text-sm text-gray-400">{t.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        ${t.usdPrice?.toFixed(4) || "N/A"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Balance Actions */}
          {balance && token && (
            <div className="mt-3 flex gap-2">
              <Button
                className="text-xs"
                size="sm"
                variant="flat"
                onPress={() => {
                  // Set amount to 25% of balance
                  const input = document.querySelector(
                    'input[type="number"]',
                  ) as HTMLInputElement;

                  if (input) {
                    input.value = (parseFloat(balance) * 0.25).toFixed(6);
                  }
                }}
              >
                25%
              </Button>
              <Button
                className="text-xs"
                size="sm"
                variant="flat"
                onPress={() => {
                  // Set amount to 50% of balance
                  const input = document.querySelector(
                    'input[type="number"]',
                  ) as HTMLInputElement;

                  if (input) {
                    input.value = (parseFloat(balance) * 0.5).toFixed(6);
                  }
                }}
              >
                50%
              </Button>
              <Button
                className="text-xs"
                size="sm"
                variant="flat"
                onPress={() => {
                  // Set amount to max balance
                  const input = document.querySelector(
                    'input[type="number"]',
                  ) as HTMLInputElement;

                  if (input) {
                    input.value = balance;
                  }
                }}
              >
                MAX
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
