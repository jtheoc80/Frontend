import React, { useState } from "react";
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input, useDisclosure, useToast
} from "@chakra-ui/react";
import { ethers } from "ethers";
// import contractAbi from "../abi/ValveChainABI.json"; // adjust path as needed

const CONTRACT_ADDRESS = "0xYourValveChainContractAddress"; // Replace with your address

const AddRepairVendorModal = ({ contract, signer }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAddVendor = async () => {
    if (!ethers.isAddress(wallet)) {
      toast({ title: "Invalid wallet address.", status: "error" });
      return;
    }
    setLoading(true);
    try {
      // Call addRepairVendor on your contract
      const tx = await contract.connect(signer).addRepairVendor(wallet);
      await tx.wait();
      toast({ title: "Vendor added!", status: "success" });
      setWallet("");
      onClose();
    } catch (e) {
      toast({ title: "Error adding vendor", description: e.message, status: "error" });
    }
    setLoading(false);
  };

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        Add Repair Vendor
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Repair Vendor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Repair Vendor Wallet Address</FormLabel>
              <Input
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                isRequired
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="purple" onClick={handleAddVendor} isLoading={loading}>
              Add Vendor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRepairVendorModal;
