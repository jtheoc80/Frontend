import React from "react";
import { Box, Table, Text } from "@chakra-ui/react";
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
    <Box overflowX="auto">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f7fafc" }}>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Valve ID</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Serial #</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Manufacturer</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Model</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Location</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Last Service</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Process Conditions</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Next Service</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Interval (months)</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #e2e8f0" }}>Due Status</th>
          </tr>
        </thead>
        <tbody>
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
              <tr key={valve.id} style={{ background: getStatusColor(daysUntil) }}>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.id}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.serial}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.manufacturer}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.model}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.location}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.status}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.lastServiceDate}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{valve.processConditions}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{nextService.format("YYYY-MM-DD")}</td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>
                  {interval}
                  {valve.plantOverrideMonths
                    ? " (Plant override)"
                    : " (Manufacturer)"}
                </td>
                <td style={{ padding: "12px", border: "1px solid #e2e8f0" }}>{statusMsg}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  </Box>
);

export default ValveTable;
