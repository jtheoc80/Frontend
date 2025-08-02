import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { 
  Table, 
  TableContainer,
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from "@chakra-ui/table";
import dayjs from "dayjs";

const valves = [
  {
    id: "VAL-001",
    serial: "SN12345",
    manufacturer: "Emerson",
    model: "A100",
    location: "Plant 1",
    status: "In Service",
    lastServiceDate: "2024-12-01",
    plantOverrideMonths: 6,
    processConditions: "High Temp",
  },
  {
    id: "VAL-002",
    serial: "SN67890",
    manufacturer: "Kitz",
    model: "B200",
    location: "Plant 2",
    status: "Needs Repair",
    lastServiceDate: "2023-10-10",
    plantOverrideMonths: null,
    processConditions: "Standard",
  },
];

const manufacturerIntervals = {
  Emerson: 18,
  Kitz: 24,
  default: 12,
};

const calculateServiceDueDate = (valve) => {
  const interval = valve.plantOverrideMonths || manufacturerIntervals[valve.manufacturer] || manufacturerIntervals.default;
  return dayjs(valve.lastServiceDate).add(interval, "month").format("YYYY-MM-DD");
};

const ValveTable = () => (
  <Box p={6}>
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Serial</Th>
            <Th>Manufacturer</Th>
            <Th>Model</Th>
            <Th>Location</Th>
            <Th>Status</Th>
            <Th>Last Service</Th>
            <Th>Service Due</Th>
            <Th>Process Conditions</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {valves.map((valve) => (
            <Tr key={valve.id}>
              <Td>{valve.id}</Td>
              <Td>{valve.serial}</Td>
              <Td>{valve.manufacturer}</Td>
              <Td>{valve.model}</Td>
              <Td>{valve.location}</Td>
              <Td>
                <Box
                  px={2}
                  py={1}
                  bg={valve.status === "Needs Repair" ? "orange.200" : "green.200"}
                  color="black"
                  rounded="md"
                  display="inline-block"
                  fontSize="sm"
                >
                  {valve.status}
                </Box>
              </Td>
              <Td>{valve.lastServiceDate}</Td>
              <Td>{calculateServiceDueDate(valve)}</Td>
              <Td>{valve.processConditions}</Td>
              <Td>
                <Button size="sm" colorScheme="purple" variant="outline" mr={2}>
                  View
                </Button>
                <Button size="sm" colorScheme="purple">
                  Edit
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </Box>
);

export default ValveTable;