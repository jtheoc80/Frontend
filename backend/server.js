const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.EXPRESS_PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data for demo purposes
const sampleVendors = [
  {
    id: 1,
    name: "Acme Valve Services",
    status: "Pending",
    msaVersion: "v1.2",
    effectiveDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Superior Valve Co",
    status: "Accepted",
    msaVersion: "v1.1",
    effectiveDate: "2024-01-01"
  }
];

const sampleAuditLogs = [
  {
    id: 1,
    user: "admin",
    action: "CREATE_VALVE",
    timestamp: "2024-01-15T10:30:00Z",
    details: "Created valve V001"
  },
  {
    id: 2,
    user: "technician",
    action: "UPDATE_STATUS",
    timestamp: "2024-01-15T11:45:00Z",
    details: "Updated valve V002 status to MAINTENANCE"
  }
];

const sampleValveHistory = [
  {
    id: 1,
    valveId: "V001",
    action: "INSTALLED",
    timestamp: "2024-01-01T08:00:00Z",
    technician: "John Doe",
    location: "Plant A - Section 1"
  },
  {
    id: 2,
    valveId: "V001",
    action: "MAINTENANCE",
    timestamp: "2024-01-15T14:30:00Z",
    technician: "Jane Smith",
    location: "Plant A - Section 1"
  }
];

// API Routes
app.get('/api/vendors', (req, res) => {
  res.json(sampleVendors);
});

app.post('/accept_msa', (req, res) => {
  const { vendorId, msaVersion } = req.body;
  console.log(`MSA accepted for vendor ${vendorId} with version ${msaVersion}`);
  res.json({ success: true, message: 'MSA accepted successfully' });
});

app.get('/api/audit_logs', (req, res) => {
  const { user, action } = req.query;
  let filteredLogs = sampleAuditLogs;
  
  if (user) {
    filteredLogs = filteredLogs.filter(log => log.user.includes(user));
  }
  
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action.includes(action));
  }
  
  res.json(filteredLogs);
});

app.post('/api/send_verification_email', (req, res) => {
  console.log('Verification email sent');
  res.json({ success: true, message: 'Verification email sent' });
});

app.post('/api/verify_2fa', (req, res) => {
  const { code } = req.body;
  // Simple validation for demo
  const isValid = code === '123456';
  res.json({ success: isValid, message: isValid ? '2FA verified' : 'Invalid code' });
});

app.get('/valve_history', (req, res) => {
  res.json(sampleValveHistory);
});

app.get('/valve_history_summary', (req, res) => {
  const summary = {
    totalValves: 25,
    activeValves: 22,
    maintenanceValves: 3,
    recentActivity: sampleValveHistory.slice(0, 5)
  };
  res.json(summary);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Express API', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express API server running on port ${PORT}`);
});

module.exports = app;