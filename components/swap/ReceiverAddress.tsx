import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { useId } from "react";

interface ReceiverAddressProps {
  receiver: string;
  setReceiver: (receiver: string) => void;
}

export default function ReceiverAddress({
  receiver,
  setReceiver,
}: ReceiverAddressProps) {

	const inputId = useId()
	const labelId = useId()

  return (
    <motion.div
      key="receiver-address"
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      initial={{ opacity: 0, x: -20 }}
      transition={{
        delay: 0.4,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="bg-black/90 backdrop-blur-sm transition-colors mt-6">
        <CardBody className="px-6 py-4 justify-center space-y-2">
          <label 
						className="block text-xs font-medium text-gray-400"						
						htmlFor={inputId}
						id={labelId}>
            Receive Wallet:
          </label>
          <input
        		aria-labelledby={labelId}
            className="w-full py-2 bg-black/80 border border-none rounded-2xl text-gray-400 focus:text-white/80 text-xl placeholder-gray-400 focus:outline-none"
        		id={inputId}
            placeholder="0x"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}
