import { Button, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import RouteDetails from "./RouteDetails";

interface RouteDetailsProps {
  quote: any;
  sourceToken: any;
  destinationToken: any;
  setShowRoutesDetails: (show: boolean) => void;
}

export default function RoutesDetails({
  quote,
  sourceToken,
  destinationToken,
  setShowRoutesDetails,
}: RouteDetailsProps) {
  return (
    <motion.div
      key="routes-details"
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      initial={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Route Details</h3>
          <Button
            color="warning"
            size="sm"
            variant="flat"
            onPress={() => setShowRoutesDetails(false)}
          >
            Back
          </Button>
        </div>

        {/* Route Details Component with Collapsible Accordions */}
        {quote && (
          <RouteDetails
            destinationToken={destinationToken}
            quote={quote}
            route={quote.bestRoute}
            sourceToken={sourceToken}
          />
        )}
      </CardBody>
    </motion.div>
  );
}
