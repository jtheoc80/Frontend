import React from "react";
import {
  Box,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  Text,
  Badge,
  VStack,
  HStack,
  Heading,
  useBreakpointValue,
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

function getStatusBadge(daysUntil: number, statusMsg: string) {
  if (daysUntil < 0) {
    return <Badge colorScheme="red" aria-label={`Overdue: ${statusMsg}`}>{statusMsg}</Badge>;
  }
  if (daysUntil < 30) {
    return <Badge colorScheme="yellow" aria-label={`Due soon: ${statusMsg}`}>{statusMsg}</Badge>;
  }
  return <Badge colorScheme="green" aria-label={`Status OK: ${statusMsg}`}>{statusMsg}</Badge>;
}

// Mobile Card Component for better mobile experience
function ValveCard({ valve }: { valve: any }) {
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
    <Box
      bg="white"
      rounded="lg"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
      p={4}
      mb={4}
      role="article"
      aria-label={`Valve ${valve.id} details`}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="sm" color="purple.700">{valve.id}</Heading>
            <Text fontSize="sm" color="gray.600">Serial: {valve.serial}</Text>
          </VStack>
          {getStatusBadge(daysUntil, statusMsg)}
        </HStack>
        
        <VStack align="stretch" spacing={2} fontSize="sm">
          <HStack justify="space-between">
            <Text fontWeight="semibold">Manufacturer:</Text>
            <Text>{valve.manufacturer}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Model:</Text>
            <Text>{valve.model}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Location:</Text>
            <Text>{valve.location}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Status:</Text>
            <Text>{valve.status}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Last Service:</Text>
            <Text>{valve.lastServiceDate}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Next Service:</Text>
            <Text>{nextService.format("YYYY-MM-DD")}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Process Conditions:</Text>
            <Text>{valve.processConditions}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontWeight="semibold">Interval:</Text>
            <Text>
              {interval} months
              {valve.plantOverrideMonths ? " (Plant override)" : " (Manufacturer)"}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}

const ValveTable = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <Box p={{ base: 2, md: 4 }}>
        <Box mb={4}>
          <Heading as="h2" size="md" mb={2}>Valve Inventory</Heading>
          <Text fontSize="sm" color="gray.600">
            {valves.length} valves total
          </Text>
        </Box>
        <Box role="region" aria-label="Valve inventory cards">
          {valves.map((valve) => (
            <ValveCard key={valve.id} valve={valve} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box p={{ base: 2, md: 4 }}>
      <Box mb={4}>
        <Heading as="h2" size="md" mb={2}>Valve Inventory</Heading>
        <Text fontSize="sm" color="gray.600">
          {valves.length} valves total
        </Text>
      </Box>
      
      {/* Desktop Table View */}
      <Box
        overflowX="auto"
        overflowY="visible"
        bg="white"
        rounded="lg"
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <TableRoot 
          variant="simple" 
          size={{ base: "sm", md: "md" }}
          role="table"
          aria-label="Valve inventory table with service information"
        >
          <TableHeader>
            <TableRow>
              <TableColumnHeader whiteSpace="nowrap" minW="80px" scope="col">Valve ID</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="100px" scope="col">Serial #</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="120px" scope="col">Manufacturer</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="80px" scope="col">Model</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="100px" scope="col">Location</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="100px" scope="col">Status</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="120px" scope="col">Last Service</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="140px" scope="col">Process Conditions</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="120px" scope="col">Next Service</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="140px" scope="col">Interval (months)</TableColumnHeader>
              <TableColumnHeader whiteSpace="nowrap" minW="150px" scope="col">Due Status</TableColumnHeader>
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
                <TableRow 
                  key={valve.id} 
                  style={{ background: getStatusColor(daysUntil) }}
                  role="row"
                  aria-label={`Valve ${valve.id}, ${statusMsg}`}
                >
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
                  <TableCell whiteSpace="nowrap">
                    {getStatusBadge(daysUntil, statusMsg)}
                  </TableCell>
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
