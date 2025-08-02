import React from "react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

const LoadingPanel: React.FC = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minH="200px"
      p={6}
    >
      <VStack spacing={4}>
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
        <Text color="gray.600">Loading panel...</Text>
      </VStack>
    </Box>
  );
};

export default LoadingPanel;