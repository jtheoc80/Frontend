Write-Output "##active_line2##"
import React, { useState, useEffect } from 'react';
Write-Output "##active_line3##"
import { Box, Text, VStack } from '@chakra-ui/react';
Write-Output "##active_line4##"
Write-Output "##active_line5##"
const ValveHistorySummaryWidget: React.FC = () => {
Write-Output "##active_line6##"
  const [summary, setSummary] = useState({
Write-Output "##active_line7##"
    totalValves: 0,
Write-Output "##active_line8##"
    dueForService: 0,
Write-Output "##active_line9##"
    underWarranty: 0,
Write-Output "##active_line10##"
    outOfService: 0,
Write-Output "##active_line11##"
  });
Write-Output "##active_line12##"
Write-Output "##active_line13##"
  useEffect(() => {
Write-Output "##active_line14##"
    fetch('/valve_history_summary')
Write-Output "##active_line15##"
      .then(response => response.json())
Write-Output "##active_line16##"
      .then(data => setSummary(data));
Write-Output "##active_line17##"
  }, []);
Write-Output "##active_line18##"
Write-Output "##active_line19##"
  return (
Write-Output "##active_line20##"
    <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md">
Write-Output "##active_line21##"
      <VStack spacing={4} align="stretch">
Write-Output "##active_line22##"
        <Text>Total Number of Valves: {summary.totalValves}</Text>
Write-Output "##active_line23##"
        <Text>Number Due for Service in Next 60 Days: {summary.dueForService}</Text>
Write-Output "##active_line24##"
        <Text>Number Under Warranty: {summary.underWarranty}</Text>
Write-Output "##active_line25##"
        <Text>Number Out of Service: {summary.outOfService}</Text>
Write-Output "##active_line26##"
      </VStack>
Write-Output "##active_line27##"
    </Box>
Write-Output "##active_line28##"
  );
Write-Output "##active_line29##"
};
Write-Output "##active_line30##"
Write-Output "##active_line31##"
export default ValveHistorySummaryWidget;
Write-Output "##active_line32##"
