const ipService = require('../services/ip');
const ipUtil = require('../utilities/ip');

exports.getIpAddresses = async (req, res) => {
    try {
        const queryParams = req.query;
        const response = await ipService.getIPAddresses(queryParams, ipUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to IP addresses' });
    }
}

exports.getIpAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await ipService.getIPAddress(id, ipUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to get IP Address' });
    }
}

exports.createIPAddress = async (req, res) => {
    try {
        const response = await ipService.createIPAddress(req.body, ipUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to create IP address' });
    }
}

exports.updateIPAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const response = await ipService.updateIPAddress(id, body, ipUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to update IP address' });
    }
}

exports.deleteIPAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await ipService.deleteIPAddress(id, ipUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to create IP address' });
    }
}

exports.getAuditLogs = async (req, res) => {
    try {
        const queryParams = req.query;
        const response = await ipService.getAuditLogs(queryParams, ipUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to audit logs' });
    }
}