const authService = require('../services/auth');
const authUtil = require('../utilities/auth');

exports.login = async (req, res) => {
    try {
        const response = await authService.login(req.body);
        
        res.json(response.data);
    } catch (err) {
        console.log('CATCH ', err);
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
        const response = await authService.logout(authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Logout failed' });
    }
}

exports.createUser = async (req, res) => {
    try {
        const response = await authService.createUser(req.body, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to create user' });
    }
}
