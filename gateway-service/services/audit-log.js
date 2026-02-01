require('dotenv').config();
const axios = require('axios');

const client = axios.create({
    baseURL: process.env.IP_SERVICE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

exports.getAuditLogs = (params, headers) => client.get(`/audit-logs`, { params, headers });
exports.createAuditLog = (data, headers) => client.post(`/audit-logs/`, data, { headers });
exports.getAuditLog = (id, headers) => client.get(`/audit-logs/${id}`, { headers });
