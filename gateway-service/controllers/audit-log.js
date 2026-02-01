const auditLogService = require('../services/audit-log');
const util = require('../utilities/ip');

exports.getAuditLogs = async (req, res) => {
    try {
        const queryParams = req.query;
        const response = await auditLogService.getAuditLogs(queryParams, util.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to fetch audit logs' });
    }
}

exports.createAuditLog = async (req, res) => {
    try {
        const response = await auditLogService.createAuditLog(req.body, util.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to create audit log' });
    }
}

exports.getAuditLog = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await auditLogService.getAuditLog(id, util.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to fetch audit log' });
    }
}