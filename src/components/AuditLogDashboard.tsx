import React, { useEffect, useState } from 'react';
import { Box, Table, TableHeader, TableBody, TableRow, TableColumnHeader, TableCell, Input } from '@chakra-ui/react';
import axios from 'axios';

const AuditLogDashboard: React.FC = () => {
    const [logs, setLogs] = useState([]);
    const [filterUser, setFilterUser] = useState('');
    const [filterAction, setFilterAction] = useState('');
    
    useEffect(() => {
        fetchLogs();
    }, [filterUser, filterAction]);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('/api/audit_logs', {
                params: {
                    user: filterUser,
                    action: filterAction,
                },
            });
            setLogs(response.data);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        }
    };

    return (
        <Box p={5}>
            <Input 
                placeholder="Filter by user" 
                value={filterUser} 
                onChange={(e) => setFilterUser(e.target.value)} 
                mb={3}
            />
            <Input 
                placeholder="Filter by action" 
                value={filterAction} 
                onChange={(e) => setFilterAction(e.target.value)} 
                mb={3}
            />
            <Table variant="simple">
                <TableHeader>
                    <TableRow>
                        <TableColumnHeader>User</TableColumnHeader>
                        <TableColumnHeader>Action</TableColumnHeader>
                        <TableColumnHeader>Timestamp</TableColumnHeader>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log: any, index) => (
                        <TableRow key={index}>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default AuditLogDashboard;