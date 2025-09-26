import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

interface SwithchTokenProps {
	className?: string;
	switchTokens: () => void;
}

export default function SwithchToken({className, switchTokens}: SwithchTokenProps) {

    return (
				<motion.div
					animate={{ opacity: 1, scale: 1 }}
					className={`relative z-10 flex items-center justify-center ${className}`}
					initial={{ opacity: 0, scale: 0.8 }}
					transition={{ delay: 0.5, duration: 0.3 }}
				>
					<Card className="bg-white/40 cursor-pointer hover:bg-white/60 border border-white/20 rounded-2xl">
						<CardBody className="p-4" onClick={switchTokens}>
								
								<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								>
									<path
										d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
								/>
							</svg>

						</CardBody>
					</Card>
				</motion.div>
    )
} 