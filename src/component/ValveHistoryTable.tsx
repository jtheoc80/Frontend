import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TableRoot, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableColumnHeader, 
  TableCell, 
  Button, 
  Input, 
  Select, 
  VStack, 
  useToast, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton 
} from '@chakra-ui/react';
import { ethers } from 'ethers';

// Replace with actual contract ABI and address
const contractABI = [ /* ABI HERE */ ];
const contractAddress = "0xYourContractAddress";

interface Valve {
  serialNumber: string;
  location: string;
  dateInstalled: string;
  lastServiceDate: string;
  serviceVendor: string;
  warrantyExpirationDate: string;
  status: string;
}

const ValveHistoryTable: React.FC = () => {
  const [valves, setValves] = useState<Valve[]>([]);
  const [filter, setFilter] = useState({ location: '', status: '', serviceVendor: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValve, setSelectedValve] = useState<Valve | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchValveHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/valve_history');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setValves(data);
        
      } catch (error) {
        console.error('Failed to fetch valve history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load valve history data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchValveHistory();
  }, [toast]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (valve: Valve) => {
    setSelectedValve(valve);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedValve(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedValve) return;

    try {
      // Check if wallet is available
      if (!window.ethereum) {
        toast({
          title: 'Wallet Required',
          description: 'Please install MetaMask or another Web3 wallet to perform this action.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Connect to Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the smart contract function
      const transaction = await contract.updateValveStatus(selectedValve.serialNumber, newStatus);
      
      toast({
        title: 'Transaction Submitted',
        description: 'Transaction has been submitted to the blockchain. Please wait for confirmation.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      await transaction.wait();

      toast({
        title: 'Success',
        description: 'Status updated successfully on the blockchain.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Update state
      setValves(prevValves => prevValves.map(valve =>
        valve.serialNumber === selectedValve.serialNumber ? { ...valve, status: newStatus } : valve
      ));

      handleCloseModal();
      
    } catch (error: any) {
      console.error('Transaction failed:', error);
      
      let errorMessage = 'An error occurred during the transaction.';
      
      if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.code === -32603) {
        errorMessage = 'Internal JSON-RPC error. Please check your network connection.';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to complete the transaction.';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Transaction Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredValves = valves.filter(valve =>
    (filter.location === '' || valve.location.includes(filter.location)) &&
    (filter.status === '' || valve.status.includes(filter.status)) &&
    (filter.serviceVendor === '' || valve.serviceVendor.includes(filter.serviceVendor))
  );

  if (loading) {
    return (
      <VStack spacing={4} align="stretch">
        <Box p={4}>Loading valve history data...</Box>
      </VStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Input placeholder="Filter by Location" name="location" onChange={handleFilterChange} />
      <Select placeholder="Filter by Status" name="status" onChange={handleFilterChange}>
        <option value="In Service">In Service</option>
        <option value="Out for Repair">Out for Repair</option>
        <option value="Retired">Retired</option>
      </Select>
      <Input placeholder="Filter by Service Vendor" name="serviceVendor" onChange={handleFilterChange} />

      <TableRoot variant="simple">
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Serial Number</TableColumnHeader>
            <TableColumnHeader>Location</TableColumnHeader>
            <TableColumnHeader>Date Installed</TableColumnHeader>
            <TableColumnHeader>Last Service Date</TableColumnHeader>
            <TableColumnHeader>Service Vendor</TableColumnHeader>
            <TableColumnHeader>Warranty Expiration Date</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
            <TableColumnHeader>Action</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredValves.map(valve => (
            <TableRow key={valve.serialNumber}>
              <TableCell>{valve.serialNumber}</TableCell>
              <TableCell>{valve.location}</TableCell>
              <TableCell>{valve.dateInstalled}</TableCell>
              <TableCell>{valve.lastServiceDate}</TableCell>
              <TableCell>{valve.serviceVendor}</TableCell>
              <TableCell>{valve.warrantyExpirationDate}</TableCell>
              <TableCell>{valve.status}</TableCell>
              <TableCell>
                <Button colorScheme="blue" onClick={() => handleOpenModal(valve)}>Update Status</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Valve Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select placeholder="Select New Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="In Service">In Service</option>
              <option value="Out for Repair">Out for Repair</option>
              <option value="Retired">Retired</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateStatus}>
              Submit
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ValveHistoryTable;