const authService = require('../services/auth');

exports.login = async (req, res) => {
    try {
        console.log('LOGIN');
        console.log(req.body);
        const response = await authService.login(req.body);
        
        res.json(response.data);
    } catch (err) {
        console.log(err);
        res.status(401).json(err.response?.data || { error: 'Login failed' });
    }
}

exports.me = async (req, res) => {
    try {
        const response = await authService.me();
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to get user' });
    }
}

exports.refresh = async (req, res) => {
    try {
        const response = await authService.refresh(req.body);
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to refresh token' });
    }
}

exports.logout = async (req, res) => {
    try {
        const response = await authService.logout(req.body);
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Logout failed' });
    }
}

exports.createUser = async (req, res) => {
    try {
        const response = await authService.createUser(req.body);
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { error: 'Failed to create user' });
    }
}
