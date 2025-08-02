import React from "react";
import {
  Box,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  Spinner,
  Alert,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useValves } from "../contexts/ValveContext";
import { Valve } from "../types/valve";

function getRecommendedInterval(valve: Valve, manufacturerIntervals: any) {
  if (valve.plantOverrideMonths) return valve.plantOverrideMonths;
  const manu = manufacturerIntervals[valve.manufacturer];
  if (manu && manu[valve.model]) return manu[valve.model];
  return 12;
}

function getNextServiceDate(valve: Valve, manufacturerIntervals: any) {
  const intervalMonths = getRecommendedInterval(valve, manufacturerIntervals);
  return dayjs(valve.lastServiceDate).add(intervalMonths, "month");
}

function getStatusColor(daysUntil: number) {
  if (daysUntil < 0) return "#ffd6d6";
  if (daysUntil < 30) return "#fff8c6";
  return "#e5f7ee";
}

const ValveTable: React.FC = () => {
  const { valves, manufacturerIntervals, loading, error } = useValves();

  if (loading) {
    return (
      <Box p={{ base: 2, md: 4 }} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" color="purple.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={{ base: 2, md: 4 }}>
        <Alert status="error">
          <Box>Error loading valve data: {error}</Box>
        </Alert>
      </Box>
    );
  }

  if (!valves || valves.length === 0) {
    return (
      <Box p={{ base: 2, md: 4 }}>
        <Alert status="info">
          <Box>No valve data available</Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={{ base: 2, md: 4 }}>
      <Box
        overflowX="auto"
        overflowY="visible"
        bg="white"
        rounded="lg"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <TableRoot variant="simple" size={{ base: "sm", md: "md" }}>
          <TableHeader>
            <TableRow>
              <TableColumnHeader whiteSpace="nowrap" minW="80px">Valve ID</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="100px">Serial #</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="120px">Manufacturer</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="80px">Model</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="100px">Location</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="100px">Status</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="120px">Last Service</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="140px">Process Conditions</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="120px">Next Service</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="140px">Interval (months)</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="150px">Due Status</TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {valves.map((valve) => {
              const nextService = getNextServiceDate(valve, manufacturerIntervals);
              const daysUntil = nextService.diff(dayjs(), "day");
              const interval = getRecommendedInterval(valve, manufacturerIntervals);
              const statusMsg =
                daysUntil < 0
                  ? `Overdue by ${-daysUntil} days`
                  : daysUntil < 30
                  ? `Due in ${daysUntil} days`
                  : "OK";
              return (
                <TableRow key={valve.id} style={{ background: getStatusColor(daysUntil) }}>
                  <TableCell whiteSpace="nowrap">{valve.id}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.serial}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.manufacturer}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.model}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.location}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.status}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.lastServiceDate}</TableCell>
                  <TableCell whiteSpace="nowrap">{valve.processConditions}</TableCell>
                  <TableCell whiteSpace="nowrap">{nextService.format("YYYY-MM-DD")}</TableCell>
                  <TableCell whiteSpace="nowrap">
                    {interval}
                    {valve.plantOverrideMonths
                      ? " (Plant override)"
                      : " (Manufacturer)"}
                  </TableCell>
                  <TableCell whiteSpace="nowrap">{statusMsg}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TableRoot>
      </Box>
    </Box>
  );
};

export default ValveTable;