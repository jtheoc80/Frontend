import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Select,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { Order } from "../../types/valve";
import valveApiService from "../../services/valveApi";

const DistributorDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await valveApiService.getPendingOrders();
      if (response.success && response.data) {
        setPendingOrders(response.data);
      }
    } catch (err) {
      setError("Failed to load pending orders");
      console.error("Orders load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = (order: Order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const confirmOrder = async () => {
    if (!selectedOrder) return;
    
    // In a real implementation, this would call an API to update the order status
    console.log("Confirming order:", selectedOrder.id);
    
    // Update local state
    setPendingOrders(orders => 
      orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, status: 'confirmed' }
          : order
      ).filter(order => order.status === 'pending')
    );
    
    onClose();
    setSelectedOrder(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'confirmed': return 'blue';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityBadge = (order: Order) => {
    if (order.notes?.toLowerCase().includes('urgent')) {
      return <Badge colorScheme="red" ml={2}>Urgent</Badge>;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading distributor dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="#1e3a8a">
          Distributor Dashboard
        </Heading>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Pending Orders Panel */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="md">Pending Orders from Manufacturers</Heading>
              <Badge colorScheme="orange" fontSize="sm">
                {pendingOrders.length} Pending
              </Badge>
            </HStack>

              {pendingOrders.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="#64748b" fontSize="lg">
                    No pending orders
                  </Text>
                  <Text color="#64748b" fontSize="sm" mt={2}>
                    You're all caught up! No new orders requiring attention.
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Valve ID</Th>
                        <Th>Manufacturer</Th>
                        <Th>Quantity</Th>
                        <Th>Order Date</Th>
                        <Th>Expected Delivery</Th>
                        <Th>Priority</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {pendingOrders.map((order) => (
                        <Tr key={order.id}>
                          <Td fontWeight="semibold">{order.id}</Td>
                          <Td>
                            <Badge colorScheme="blue" variant="subtle">
                              {order.valveId}
                            </Badge>
                          </Td>
                          <Td>{order.manufacturerId}</Td>
                          <Td>{order.quantity}</Td>
                          <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                          <Td>
                            {order.expectedDeliveryDate 
                              ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                              : 'TBD'
                            }
                          </Td>
                          <Td>
                            <HStack>
                              <Badge colorScheme={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              {getPriorityBadge(order)}
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => handleConfirmOrder(order)}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                              >
                                View Details
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
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
              <Button colorScheme="orange" variant="outline">
                Contact Manufacturer
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Order Statistics */}
        <Box bg="white" p={6} borderRadius="md" shadow="sm" border="1px solid #e2e8f0">
          <VStack spacing={4} align="stretch">
            <Heading size="md">Quick Stats</Heading>
            <HStack spacing={8}>
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

      {/* Order Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <VStack spacing={4} align="stretch">
                <Text>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </Text>
                <Text>
                  <strong>Valve ID:</strong> {selectedOrder.valveId}
                </Text>
                <Text>
                  <strong>Quantity:</strong> {selectedOrder.quantity}
                </Text>
                <Text>
                  <strong>Expected Delivery:</strong> {selectedOrder.expectedDeliveryDate 
                    ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()
                    : 'TBD'
                  }
                </Text>
                {selectedOrder.notes && (
                  <Text>
                    <strong>Notes:</strong> {selectedOrder.notes}
                  </Text>
                )}
                <Text fontSize="sm" color="#64748b" mt={4}>
                  Are you sure you want to confirm this order? This action cannot be undone.
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={confirmOrder}>
              Confirm Order
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default DistributorDashboard;