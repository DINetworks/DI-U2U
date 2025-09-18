import { useState } from 'react';
import { Select, SelectItem } from '@heroui/select';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { SwapToken, SwapTokenSelectorProps } from '@/types/swap';
import { normalizeTokenLogoURI } from '@/utils/token';

export default function SwapTokenSelector({
  token,
  onTokenSelect,
  tokens,
  label,
  disabled = false,
  balance
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
              variant="flat"
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled}
              className="min-w-[140px] h-12 bg-white/5 hover:bg-white/10"
            >
              <div className="flex items-center gap-2">
                {token ? (
                  <>
                    <Image
                      src={normalizeTokenLogoURI(token.logoURI)}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-white">{token.symbol}</div>
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
                placeholder="0.00"
                type="number"
                className="text-right"
                disabled={disabled}
                size="lg"
                classNames={{
                  input: "text-white text-right text-lg font-semibold bg-transparent",
                  inputWrapper: "bg-white/5 hover:bg-white/10 border-white/20"
                }}
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
                    onClick={() => {
                      onTokenSelect(t);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Image
                      src={normalizeTokenLogoURI(t.logoURI)}
                      alt={t.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">{t.symbol}</div>
                      <div className="text-sm text-gray-400">{t.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        ${t.usdPrice?.toFixed(4) || 'N/A'}
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
                size="sm"
                variant="flat"
                className="text-xs"
                onPress={() => {
                  // Set amount to 25% of balance
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                  if (input) {
                    input.value = (parseFloat(balance) * 0.25).toFixed(6);
                  }
                }}
              >
                25%
              </Button>
              <Button
                size="sm"
                variant="flat"
                className="text-xs"
                onPress={() => {
                  // Set amount to 50% of balance
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                  if (input) {
                    input.value = (parseFloat(balance) * 0.5).toFixed(6);
                  }
                }}
              >
                50%
              </Button>
              <Button
                size="sm"
                variant="flat"
                className="text-xs"
                onPress={() => {
                  // Set amount to max balance
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement;
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