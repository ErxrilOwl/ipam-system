const authService = require('../services/auth');
const auditLogService = require('../services/audit-log');
const authUtil = require('../utilities/auth');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const response = await authService.login(req.body);
        
        auditLogService.createAuditLog({
            'action': 'AUTH_LOGIN',
            'resource_type': 'user',
            'resource_id': response.data.user.id,
            'user_id': response.data.user.id,
            'user_name': response.data.user.name,
            'user_role': response.data.user.role,
            'session_id': response.data.session_id
        });

        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Login failed' });
    }
}

exports.me = async (req, res) => {
    try {
        const response = await authService.me(authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to get user' });
    }
}

exports.refresh = async (req, res) => {
    try {
        const response = await authService.refresh(req.body, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to refresh token' });
    }
}

exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        auditLogService.createAuditLog({
            'action': 'AUTH_LOGOUT',
            'resource_type': 'user',
            'resource_id': decoded.sub,
            'user_id': decoded.sub,
            'user_name': decoded.name,
            'user_role': decoded.role,
            'session_id': decoded.session_id
        });

        const response = await authService.logout(authUtil.getAuthHeaders(req));

        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Logout failed' });
    }
}
