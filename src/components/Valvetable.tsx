import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
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
  Emerson: { A100: 12 },
  Kitz: { B200: 18 },
};

function getRecommendedInterval(valve: any) {
  if (valve.plantOverrideMonths) return valve.plantOverrideMonths;
  const manu = manufacturerIntervals[valve.manufacturer];
  if (manu && manu[valve.model]) return manu[valve.model];
  return 12;
}

function getNextServiceDate(valve: any) {
  const intervalMonths = getRecommendedInterval(valve);
  return dayjs(valve.lastServiceDate).add(intervalMonths, "month");
}

function getStatusColor(daysUntil: number) {
  if (daysUntil < 0) return "#ffd6d6";
  if (daysUntil < 30) return "#fff8c6";
  return "#e5f7ee";
}

const ValveTable = () => (
  <Box p={4}>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Valve ID</Th>
          <Th>Serial #</Th>
          <Th>Manufacturer</Th>
          <Th>Model</Th>
          <Th>Location</Th>
          <Th>Status</Th>
          <Th>Last Service</Th>
          <Th>Process Conditions</Th>
          <Th>Next Service</Th>
          <Th>Interval (months)</Th>
          <Th>Due Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {valves.map((valve) => {
          const nextService = getNextServiceDate(valve);
          const daysUntil = nextService.diff(dayjs(), "day");
          const interval = getRecommendedInterval(valve);
          const statusMsg =
            daysUntil < 0
              ? `Overdue by ${-daysUntil} days`
              : daysUntil < 30
              ? `Due in ${daysUntil} days`
              : "OK";
          return (
            <Tr key={valve.id} style={{ background: getStatusColor(daysUntil) }}>
              <Td>{valve.id}</Td>
              <Td>{valve.serial}</Td>
              <Td>{valve.manufacturer}</Td>
              <Td>{valve.model}</Td>
              <Td>{valve.location}</Td>
              <Td>{valve.status}</Td>
              <Td>{valve.lastServiceDate}</Td>
              <Td>{valve.processConditions}</Td>
              <Td>{nextService.format("YYYY-MM-DD")}</Td>
              <Td>
                {interval}
                {valve.plantOverrideMonths
                  ? " (Plant override)"
                  : " (Manufacturer)"}
              </Td>
              <Td>{statusMsg}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);

export default ValveTable;
