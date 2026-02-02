const jwt = require('jsonwebtoken');
const auditLogService = require('../services/audit-log');

exports.getAuthHeaders = (req) => {
    return {
        'Authorization': req.headers.authorization
    }
}

exports.auditLogger = (req, action, resource_type, resource_id, before = null, after = null) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    auditLogService.createAuditLog({
        'action': action,
        'resource_type': resource_type,
        'resource_id': resource_id,
        'before': before,
        'after': after,
        'user_id': decoded.sub,
        'user_name': decoded.name,
        'user_role': decoded.role,
        'session_id': decoded.session_id
    });
}