import React, { useEffect, useState } from 'react';
import { 
  Box, 
  TableRoot, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableColumnHeader, 
  TableCell, 
  Input,
  useToast,
  Text,
  VStack 
} from '@chakra-ui/react';
import axios from 'axios';

const AuditLogDashboard: React.FC = () => {
    const [logs, setLogs] = useState([]);
    const [filterUser, setFilterUser] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    
    useEffect(() => {
        fetchLogs();
    }, [filterUser, filterAction]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/audit_logs', {
                params: {
                    user: filterUser,
                    action: filterAction,
                },
            });
            
            if (response.status === 200) {
                setLogs(response.data);
            }
            
        } catch (error: any) {
            console.error('Failed to fetch audit logs:', error);
            
            let errorMessage = 'Failed to load audit logs. Please try again later.';
            
            if (error.response?.status === 403) {
                errorMessage = 'You do not have permission to view audit logs.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={5}>
            <Input 
                placeholder="Filter by User" 
                value={filterUser} 
                onChange={(e) => setFilterUser(e.target.value)} 
                mb={3}
            />
            <Input 
                placeholder="Filter by Action" 
                value={filterAction} 
                onChange={(e) => setFilterAction(e.target.value)} 
                mb={3}
            />
            
            <TableRoot variant="simple">
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>User</TableColumnHeader>
                        <TableColumnHeader>Action</TableColumnHeader>
                        <TableColumnHeader>Timestamp</TableColumnHeader>
                        <TableColumnHeader>Details</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                            <TableCell>{log.details}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TableRoot>
        </Box>
    );
};

export default AuditLogDashboard;