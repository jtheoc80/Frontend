import React from 'react';
import { 
  Box, 
  Heading, 
  TableRoot, 
  TableColumnHeader, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell, 
  Button, 
  Input 
} from '@chakra-ui/react';

const MSAManagementDashboard: React.FC = () => {
  return (
    <Box p={5}>
      <Heading mb={5}>MSA Management Dashboard</Heading>
      <Input type="file" accept="application/pdf,text/html" mb={5} />
      <Button colorScheme="teal" mb={5}>Upload MSA Template</Button>

      <TableRoot variant="simple">
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Version</TableColumnHeader>
            <TableColumnHeader>Effective Date</TableColumnHeader>
            <TableColumnHeader>Vendor</TableColumnHeader>
            <TableColumnHeader>Status</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* Sample Data, replace with dynamic content */}
            <TableCell>v1.0</TableCell>
            <TableCell>2025-07-29</TableCell>
            <TableCell>Vendor A</TableCell>
            <TableCell>Accepted</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    </Box>
  );
};

export default MSAManagementDashboard;
