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
Write-Output "##active_line6##"
// Replace with actual contract ABI and address
Write-Output "##active_line7##"
const contractABI = [ /* ABI HERE */ ];
Write-Output "##active_line8##"
const contractAddress = "0xYourContractAddress";
Write-Output "##active_line9##"
Write-Output "##active_line10##"
const ValveHistoryTable: React.FC = () => {
Write-Output "##active_line11##"
  const [valves, setValves] = useState([]);
Write-Output "##active_line12##"
  const [filter, setFilter] = useState({ location: '', status: '', serviceVendor: '' });
Write-Output "##active_line13##"
  const [isOpen, setIsOpen] = useState(false);
Write-Output "##active_line14##"
  const [selectedValve, setSelectedValve] = useState(null);
Write-Output "##active_line15##"
  const [newStatus, setNewStatus] = useState('');
Write-Output "##active_line16##"
  const toast = useToast();
Write-Output "##active_line17##"
Write-Output "##active_line18##"
  useEffect(() => {
Write-Output "##active_line19##"
    fetch('/valve_history')
Write-Output "##active_line20##"
      .then(response => response.json())
Write-Output "##active_line21##"
      .then(data => setValves(data));
Write-Output "##active_line22##"
  }, []);
Write-Output "##active_line23##"
Write-Output "##active_line24##"
  const handleFilterChange = (e) => {
Write-Output "##active_line25##"
    setFilter({
Write-Output "##active_line26##"
      ...filter,
Write-Output "##active_line27##"
      [e.target.name]: e.target.value
Write-Output "##active_line28##"
    });
Write-Output "##active_line29##"
  };
Write-Output "##active_line30##"
Write-Output "##active_line31##"
  const handleOpenModal = (valve) => {
Write-Output "##active_line32##"
    setSelectedValve(valve);
Write-Output "##active_line33##"
    setIsOpen(true);
Write-Output "##active_line34##"
  };
Write-Output "##active_line35##"
Write-Output "##active_line36##"
  const handleCloseModal = () => {
Write-Output "##active_line37##"
    setIsOpen(false);
Write-Output "##active_line38##"
    setSelectedValve(null);
Write-Output "##active_line39##"
    setNewStatus('');
Write-Output "##active_line40##"
  };
Write-Output "##active_line41##"
Write-Output "##active_line42##"
  const handleUpdateStatus = async () => {
Write-Output "##active_line43##"
    try {
Write-Output "##active_line44##"
      // Connect to Ethereum network
Write-Output "##active_line45##"
      const provider = new ethers.providers.Web3Provider(window.ethereum);
Write-Output "##active_line46##"
      const signer = provider.getSigner();
Write-Output "##active_line47##"
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
Write-Output "##active_line48##"
Write-Output "##active_line49##"
      // Call the smart contract function
Write-Output "##active_line50##"
      const transaction = await contract.updateValveStatus(selectedValve.serialNumber, newStatus);
Write-Output "##active_line51##"
      await transaction.wait();
Write-Output "##active_line52##"
Write-Output "##active_line53##"
      toast({
Write-Output "##active_line54##"
        title: 'Success',
Write-Output "##active_line55##"
        description: 'Status updated successfully.',
Write-Output "##active_line56##"
        status: 'success',
Write-Output "##active_line57##"
        duration: 5000,
Write-Output "##active_line58##"
        isClosable: true,
Write-Output "##active_line59##"
      });
Write-Output "##active_line60##"
Write-Output "##active_line61##"
      // Update state
Write-Output "##active_line62##"
      setValves(prevValves => prevValves.map(valve =>
Write-Output "##active_line63##"
        valve.serialNumber === selectedValve.serialNumber ? { ...valve, status: newStatus } : valve
Write-Output "##active_line64##"
      ));
Write-Output "##active_line65##"
Write-Output "##active_line66##"
      handleCloseModal();
Write-Output "##active_line67##"
    } catch (error) {
Write-Output "##active_line68##"
      toast({
Write-Output "##active_line69##"
        title: 'Transaction Error',
Write-Output "##active_line70##"
        description: error.message || 'An error occurred during the transaction.',
Write-Output "##active_line71##"
        status: 'error',
Write-Output "##active_line72##"
        duration: 5000,
Write-Output "##active_line73##"
        isClosable: true,
Write-Output "##active_line74##"
      });
Write-Output "##active_line75##"
    }
Write-Output "##active_line76##"
  };
Write-Output "##active_line77##"
Write-Output "##active_line78##"
  const filteredValves = valves.filter(valve =>
Write-Output "##active_line79##"
    (filter.location === '' || valve.location.includes(filter.location)) &&
Write-Output "##active_line80##"
    (filter.status === '' || valve.status.includes(filter.status)) &&
Write-Output "##active_line81##"
    (filter.serviceVendor === '' || valve.serviceVendor.includes(filter.serviceVendor))
Write-Output "##active_line82##"
  );
Write-Output "##active_line83##"
Write-Output "##active_line84##"
  return (
Write-Output "##active_line85##"
    <VStack spacing={4} align="stretch">
Write-Output "##active_line86##"
      <Input placeholder="Filter by Location" name="location" onChange={handleFilterChange} />
Write-Output "##active_line87##"
      <Select placeholder="Filter by Status" name="status" onChange={handleFilterChange}>
Write-Output "##active_line88##"
        <option value="In Service">In Service</option>
Write-Output "##active_line89##"
        <option value="Out for Repair">Out for Repair</option>
Write-Output "##active_line90##"
        <option value="Retired">Retired</option>
Write-Output "##active_line91##"
      </Select>
Write-Output "##active_line92##"
      <Input placeholder="Filter by Service Vendor" name="serviceVendor" onChange={handleFilterChange} />
Write-Output "##active_line93##"
Write-Output "##active_line94##"
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
Write-Output "##active_line125##"
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
Write-Output "##active_line126##"
        <ModalOverlay />
Write-Output "##active_line127##"
        <ModalContent>
Write-Output "##active_line128##"
          <ModalHeader>Update Valve Status</ModalHeader>
Write-Output "##active_line129##"
          <ModalCloseButton />
Write-Output "##active_line130##"
          <ModalBody>
Write-Output "##active_line131##"
            <Select placeholder="Select New Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
Write-Output "##active_line132##"
              <option value="In Service">In Service</option>
Write-Output "##active_line133##"
              <option value="Out for Repair">Out for Repair</option>
Write-Output "##active_line134##"
              <option value="Retired">Retired</option>
Write-Output "##active_line135##"
            </Select>
Write-Output "##active_line136##"
          </ModalBody>
Write-Output "##active_line137##"
Write-Output "##active_line138##"
          <ModalFooter>
Write-Output "##active_line139##"
            <Button colorScheme="blue" mr={3} onClick={handleUpdateStatus}>
Write-Output "##active_line140##"
              Submit
Write-Output "##active_line141##"
            </Button>
Write-Output "##active_line142##"
            <Button variant="ghost" onClick={handleCloseModal}>Cancel</Button>
Write-Output "##active_line143##"
          </ModalFooter>
Write-Output "##active_line144##"
        </ModalContent>
Write-Output "##active_line145##"
      </Modal>
Write-Output "##active_line146##"
    </VStack>
Write-Output "##active_line147##"
  );
Write-Output "##active_line148##"
};
Write-Output "##active_line149##"
Write-Output "##active_line150##"
export default ValveHistoryTable;
Write-Output "##active_line151##"
