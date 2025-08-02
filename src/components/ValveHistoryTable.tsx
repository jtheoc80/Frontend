import React, { useState, useEffect } from 'react';
import { Box, Table, TableHeader, TableBody, TableRow, TableColumnHeader, TableCell, Button, Input, Select, VStack, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { ethers } from 'ethers';
// Replace with actual contract ABI and address
const contractABI = [ /* ABI HERE */ ];
const contractAddress = "0xYourContractAddress";
const ValveHistoryTable: React.FC = () => {
  const [valves, setValves] = useState([]);
  const [filter, setFilter] = useState({ location: '', status: '', serviceVendor: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValve, setSelectedValve] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const toast = useToast();
  useEffect(() => {
    fetch('/valve_history')
      .then(response => response.json())
      .then(data => setValves(data));
  }, []);
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };
  const handleOpenModal = (valve) => {
    setSelectedValve(valve);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedValve(null);
    setNewStatus('');
  };
  const handleUpdateStatus = async () => {
    try {
      // Connect to Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      // Call the smart contract function
      const transaction = await contract.updateValveStatus(selectedValve.serialNumber, newStatus);
      await transaction.wait();
      toast({
        title: 'Success',
        description: 'Status updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Update state
      setValves(prevValves => prevValves.map(valve =>
        valve.serialNumber === selectedValve.serialNumber ? { ...valve, status: newStatus } : valve
      ));
      handleCloseModal();
    } catch (error) {
      toast({
        title: 'TableRowansaction Error',
        description: error.message || 'An error occurred during the transaction.',
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
  return (
    <VStack spacing={4} align="stretch">
      <Input placeholder="Filter by Location" name="location" onChange={handleFilterChange} />
      <Select placeholder="Filter by Status" name="status" onChange={handleFilterChange}>
        <option value="In Service">In Service</option>
        <option value="Out for Repair">Out for Repair</option>
        <option value="Retired">Retired</option>
      </Select>
      <Input placeholder="Filter by Service Vendor" name="serviceVendor" onChange={handleFilterChange} />
      <Table variant="simple">
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
      </Table>
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
