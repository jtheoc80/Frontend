import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Table } from "@chakra-ui/table";
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
    <Table.Root variant="simple">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Valve ID</Table.ColumnHeader>
          <Table.ColumnHeader>Serial #</Table.ColumnHeader>
          <Table.ColumnHeader>Manufacturer</Table.ColumnHeader>
          <Table.ColumnHeader>Model</Table.ColumnHeader>
          <Table.ColumnHeader>Location</Table.ColumnHeader>
          <Table.ColumnHeader>Status</Table.ColumnHeader>
          <Table.ColumnHeader>Last Service</Table.ColumnHeader>
          <Table.ColumnHeader>Process Conditions</Table.ColumnHeader>
          <Table.ColumnHeader>Next Service</Table.ColumnHeader>
          <Table.ColumnHeader>Interval (months)</Table.ColumnHeader>
          <Table.ColumnHeader>Due Status</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
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
            <Table.Row key={valve.id} style={{ background: getStatusColor(daysUntil) }}>
              <Table.Cell>{valve.id}</Table.Cell>
              <Table.Cell>{valve.serial}</Table.Cell>
              <Table.Cell>{valve.manufacturer}</Table.Cell>
              <Table.Cell>{valve.model}</Table.Cell>
              <Table.Cell>{valve.location}</Table.Cell>
              <Table.Cell>{valve.status}</Table.Cell>
              <Table.Cell>{valve.lastServiceDate}</Table.Cell>
              <Table.Cell>{valve.processConditions}</Table.Cell>
              <Table.Cell>{nextService.format("YYYY-MM-DD")}</Table.Cell>
              <Table.Cell>
                {interval}
                {valve.plantOverrideMonths
                  ? " (Plant override)"
                  : " (Manufacturer)"}
              </Table.Cell>
              <Table.Cell>{statusMsg}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  </Box>
);

export default ValveTable;
