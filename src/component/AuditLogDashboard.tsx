import React, { useEffect, useState } from 'react';
import { 
  Box, 
  TableRoot, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableColumnHeader, 
  TableCell, 
  Input 
} from '@chakra-ui/react';
import axios from 'axios';
import { AuditLog } from '../types';

const AuditLogDashboard: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
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
                    {logs.map((log: AuditLog, index: number) => (
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