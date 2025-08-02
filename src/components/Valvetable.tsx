import React from "react";
import {
  Box,
  Table,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  Button,
} from "@chakra-ui/react";
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
  <Box p={4} overflow="auto">
    <TableRoot variant="simple">
      <Table>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Valve ID</TableColumnHeader>
            <TableColumnHeader>Serial #</TableColumnHeader>
            <TableColumnHeader>Manufacturer</TableColumnHeader>
            <TableColumnHeader>Model</TableColumnHeader>
            <TableColumnHeader>Location</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
            <TableColumnHeader>Last Service</TableColumnHeader>
            <TableColumnHeader>Process Conditions</TableColumnHeader>
            <TableColumnHeader>Next Service</TableColumnHeader>
            <TableColumnHeader>Interval (months)</TableColumnHeader>
            <TableColumnHeader>Due Status</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
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
              <TableRow key={valve.id} style={{ background: getStatusColor(daysUntil) }}>
                <TableCell>{valve.id}</TableCell>
                <TableCell>{valve.serial}</TableCell>
                <TableCell>{valve.manufacturer}</TableCell>
                <TableCell>{valve.model}</TableCell>
                <TableCell>{valve.location}</TableCell>
                <TableCell>{valve.status}</TableCell>
                <TableCell>{valve.lastServiceDate}</TableCell>
                <TableCell>{valve.processConditions}</TableCell>
                <TableCell>{nextService.format("YYYY-MM-DD")}</TableCell>
                <TableCell>
                  {interval}
                  {valve.plantOverrideMonths
                    ? " (Plant override)"
                    : " (Manufacturer)"}
                </TableCell>
                <TableCell>{statusMsg}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableRoot>
  </Box>
);

export default ValveTable;
