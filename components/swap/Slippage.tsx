import { Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function SlippageSetting({
  slippage,
  setSlippage,
}: {
  slippage: number;
  setSlippage: (value: number) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mt-6"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <span className="text-sm text-gray-300">Slippage Tolerance</span>
      <div className="flex gap-2">
        {[0.1, 0.5, 1.0].map((value, index) => (
          <motion.div
            key={value}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{
              delay: 0.5 + index * 0.1,
              duration: 0.2,
            }}
          >
            <Button
              className="text-xs"
              color="warning"
              size="sm"
              variant={slippage === value ? "solid" : "flat"}
              onPress={() => setSlippage(value)}
            >
              {value}%
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
