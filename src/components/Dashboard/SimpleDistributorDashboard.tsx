import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Container
} from "@chakra-ui/react";

const SimpleDistributorDashboard = () => {
  // Mock data for demonstration
  const pendingOrders = [
    {
      id: 'ORD001',
      valveId: 'VLV001',
      manufacturerId: 'Emerson',
      quantity: 1,
      orderDate: '2024-01-16',
      expectedDeliveryDate: '2024-01-30',
      status: 'pending',
      notes: 'Urgent delivery required'
    }
  ];

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Distributor Dashboard
        </Heading>

        {/* Pending Orders Panel */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="md">Pending Orders from Manufacturers</Heading>
              <Badge colorScheme="orange" fontSize="sm">
                {pendingOrders.length} Pending
              </Badge>
            </HStack>

            <VStack spacing={3}>
              {pendingOrders.map((order) => (
                <Box 
                  key={order.id}
                  p={4} 
                  bg="gray.50" 
                  borderRadius="md" 
                  w="full"
                  border="1px solid #e2e8f0"
                >
                  <HStack justify="space-between" mb={2}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="lg">Order {order.id}</Text>
                      <Text fontSize="sm" color="#64748b">
                        Valve: <Badge colorScheme="blue" variant="subtle">{order.valveId}</Badge> • 
                        Manufacturer: {order.manufacturerId}
                      </Text>
                      <Text fontSize="sm" color="#64748b">
                        Quantity: {order.quantity} • 
                        Order Date: {new Date(order.orderDate).toLocaleDateString()}
                      </Text>
                      <Text fontSize="sm" color="#64748b">
                        Expected Delivery: {order.expectedDeliveryDate 
                          ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                          : 'TBD'
                        }
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={2}>
                      <HStack>
                        <Badge colorScheme="orange">{order.status}</Badge>
                        {order.notes?.toLowerCase().includes('urgent') && (
                          <Badge colorScheme="red">Urgent</Badge>
                        )}
                      </HStack>
                      <HStack spacing={2}>
                        <Button size="sm" colorScheme="green">
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" colorScheme="blue">
                          Details
                        </Button>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>

        {/* Order Management Tools */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Order Management</Heading>
            <HStack spacing={4}>
              <Button colorScheme="blue" variant="outline">
                Create New Order
              </Button>
              <Button colorScheme="green" variant="outline">
                Bulk Confirm
              </Button>
              <Button colorScheme="purple" variant="outline">
                Export Orders
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Quick Stats */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Quick Stats</Heading>
            <HStack spacing={8} justify="center">
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="#1e3a8a">
                  {pendingOrders.length}
                </Text>
                <Text fontSize="sm" color="#64748b">Pending Orders</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="#f59e0b">
                  {pendingOrders.filter(o => o.notes?.toLowerCase().includes('urgent')).length}
                </Text>
                <Text fontSize="sm" color="#64748b">Urgent Orders</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="#10b981">
                  {pendingOrders.reduce((sum, order) => sum + order.quantity, 0)}
                </Text>
                <Text fontSize="sm" color="#64748b">Total Valves</Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SimpleDistributorDashboard;