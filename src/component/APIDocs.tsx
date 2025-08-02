Write-Output "##active_line2##"
import React, { useRef } from 'react';
Write-Output "##active_line3##"
import { Box, Heading, Text, VStack, StackDivider, Code, Button } from '@chakra-ui/react';
Write-Output "##active_line4##"
import jsPDF from 'jspdf';
Write-Output "##active_line5##"
import html2canvas from 'html2canvas';
Write-Output "##active_line6##"
Write-Output "##active_line7##"
const APIDocs: React.FC = () => {
Write-Output "##active_line8##"
  const docRef = useRef<HTMLDivElement>(null);
Write-Output "##active_line9##"
Write-Output "##active_line10##"
  const apiEndpoints = [
Write-Output "##active_line11##"
    {
Write-Output "##active_line12##"
      path: '/register_vendor',
Write-Output "##active_line13##"
      method: 'POST',
Write-Output "##active_line14##"
      description: 'Registers a new vendor in the system.',
Write-Output "##active_line15##"
      exampleRequest: {
Write-Output "##active_line16##"
        vendorName: 'Vendor A',
Write-Output "##active_line17##"
        email: 'contact@vendora.com',
Write-Output "##active_line18##"
      },
Write-Output "##active_line19##"
      exampleResponse: {
Write-Output "##active_line20##"
        status: 'success',
Write-Output "##active_line21##"
        vendorId: '12345',
Write-Output "##active_line22##"
      },
Write-Output "##active_line23##"
    },
Write-Output "##active_line24##"
    {
Write-Output "##active_line25##"
      path: '/valve_history',
Write-Output "##active_line26##"
      method: 'GET',
Write-Output "##active_line27##"
      description: 'Retrieves the history of all valves.',
Write-Output "##active_line28##"
      exampleRequest: {},
Write-Output "##active_line29##"
      exampleResponse: [
Write-Output "##active_line30##"
        {
Write-Output "##active_line31##"
          serialNumber: 'SN123',
Write-Output "##active_line32##"
          location: 'Plant A',
Write-Output "##active_line33##"
          status: 'In Service',
Write-Output "##active_line34##"
        },
Write-Output "##active_line35##"
      ],
Write-Output "##active_line36##"
    },
Write-Output "##active_line37##"
    {
Write-Output "##active_line38##"
      path: '/accept_msa',
Write-Output "##active_line39##"
      method: 'POST',
Write-Output "##active_line40##"
      description: 'Accepts the Master Service Agreement for a vendor.',
Write-Output "##active_line41##"
      exampleRequest: {
Write-Output "##active_line42##"
        vendorId: '12345',
Write-Output "##active_line43##"
        msaVersion: 'v1.0',
Write-Output "##active_line44##"
      },
Write-Output "##active_line45##"
      exampleResponse: {
Write-Output "##active_line46##"
        status: 'accepted',
Write-Output "##active_line47##"
        effectiveDate: '2023-07-01',
Write-Output "##active_line48##"
      },
Write-Output "##active_line49##"
    },
Write-Output "##active_line50##"
    {
Write-Output "##active_line51##"
      path: '/record_valve_event',
Write-Output "##active_line52##"
      method: 'POST',
Write-Output "##active_line53##"
      description: 'Records a new event for a valve.',
Write-Output "##active_line54##"
      exampleRequest: {
Write-Output "##active_line55##"
        valveId: 'SN123',
Write-Output "##active_line56##"
        newStatus: 'Out for Repair',
Write-Output "##active_line57##"
        notes: 'Leak detected.',
Write-Output "##active_line58##"
      },
Write-Output "##active_line59##"
      exampleResponse: {
Write-Output "##active_line60##"
        status: 'success',
Write-Output "##active_line61##"
        txHash: '0x1234abcd5678efgh',
Write-Output "##active_line62##"
      },
Write-Output "##active_line63##"
    },
Write-Output "##active_line64##"
  ];
Write-Output "##active_line65##"
Write-Output "##active_line66##"
  const handleDownloadPDF = async () => {
Write-Output "##active_line67##"
    if (docRef.current) {
Write-Output "##active_line68##"
      const canvas = await html2canvas(docRef.current);
Write-Output "##active_line69##"
      const imgData = canvas.toDataURL('image/png');
Write-Output "##active_line70##"
      const pdf = new jsPDF();
Write-Output "##active_line71##"
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 0);
Write-Output "##active_line72##"
      pdf.save('ValveChain_API_Docs.pdf');
Write-Output "##active_line73##"
    }
Write-Output "##active_line74##"
  };
Write-Output "##active_line75##"
Write-Output "##active_line76##"
  return (
Write-Output "##active_line77##"
    <Box p={5}>
Write-Output "##active_line78##"
      <Button mb={4} colorScheme="teal" onClick={handleDownloadPDF}>Download as PDF</Button>
Write-Output "##active_line79##"
      <div ref={docRef}>
Write-Output "##active_line80##"
      <Heading mb={5}>ValveChain API Documentation</Heading>
Write-Output "##active_line81##"
      <VStack
Write-Output "##active_line82##"
        divider={<StackDivider borderColor="gray.200" />}
Write-Output "##active_line83##"
        spacing={5}
Write-Output "##active_line84##"
        align="stretch"
Write-Output "##active_line85##"
      >
Write-Output "##active_line86##"
        {apiEndpoints.map((endpoint, index) => (
Write-Output "##active_line87##"
          <Box key={index} p={3} shadow="md" borderWidth="1px" borderRadius="md">
Write-Output "##active_line88##"
            <Text fontWeight="bold">{endpoint.method} {endpoint.path}</Text>
Write-Output "##active_line89##"
            <Text mb={3}>{endpoint.description}</Text>
Write-Output "##active_line90##"
            <Text fontWeight="bold">Example Request:</Text>
Write-Output "##active_line91##"
            <Code display="block" mb={3} p={3} bg="gray.50">
Write-Output "##active_line92##"
              {JSON.stringify(endpoint.exampleRequest, null, 2)}
Write-Output "##active_line93##"
            </Code>
Write-Output "##active_line94##"
            <Text fontWeight="bold">Example Response:</Text>
Write-Output "##active_line95##"
            <Code display="block" p={3} bg="gray.50">
Write-Output "##active_line96##"
              {JSON.stringify(endpoint.exampleResponse, null, 2)}
Write-Output "##active_line97##"
            </Code>
Write-Output "##active_line98##"
          </Box>
Write-Output "##active_line99##"
        ))}
Write-Output "##active_line100##"
      </VStack>
Write-Output "##active_line101##"
Write-Output "##active_line102##"
      <Box mt={10}>
Write-Output "##active_line103##"
        <Heading size="md" mb={3}>Quickstart: How to Connect</Heading>
Write-Output "##active_line104##"
        <Text mb={3}>
Write-Output "##active_line105##"
          To start using the API, authenticate using a valid API key. Add the following header to your requests:
Write-Output "##active_line106##"
        </Text>
Write-Output "##active_line107##"
        <Code display="block" mb={3} p={3} bg="gray.50">
Write-Output "##active_line108##"
          Authorization: Bearer YOUR_API_KEY
Write-Output "##active_line109##"
        </Code>
Write-Output "##active_line110##"
Write-Output "##active_line111##"
        <Text mb={3}>Ensure you handle errors gracefully. A typical error response contains:</Text>
Write-Output "##active_line112##"
        <Code display="block" mb={3} p={3} bg="gray.50">
Write-Output "##active_line113##"
          {'{\n  "error": "Invalid request",\n  "message": "Detailed explanation of error."\n}'}
Write-Output "##active_line114##"
        </Code>
Write-Output "##active_line115##"
Write-Output "##active_line116##"
        <Text mb={3}>Refer to each endpoint's documentation above for required and optional fields.</Text>
Write-Output "##active_line117##"
      </Box>
Write-Output "##active_line118##"
      </div>
Write-Output "##active_line119##"
    </Box>
Write-Output "##active_line120##"
  );
Write-Output "##active_line121##"
};
Write-Output "##active_line122##"
Write-Output "##active_line123##"
export default APIDocs;
Write-Output "##active_line124##"
