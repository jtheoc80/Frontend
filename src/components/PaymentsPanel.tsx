import React from "react";
import { Box, Heading } from "@chakra-ui/react";

const PaymentsPanel: React.FC = () => {
  return (
    <Box p={6}>
      <Heading size="md">Payments Panel (Coming Soon)</Heading>
      <Box mt={4}>
        <p>This panel will handle payment processing and billing.</p>
      </Box>
    </Box>
  );
};

export default PaymentsPanel;