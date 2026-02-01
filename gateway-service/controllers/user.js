const userService = require('../services/user');
const authUtil = require('../utilities/auth');

exports.getUsers = async (req, res) => {
    try {
        const queryParams = req.query;
        const response = await userService.getUsers(queryParams, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to fetch Users' });
    }
}

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await userService.getUser(id, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to fetch User' });
    }
}

exports.createUser = async (req, res) => {
    try {
        const response = await userService.createUser(req.body, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to create User' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const response = await userService.updateUser(id, body, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to update User' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await userService.deleteUser(id, authUtil.getAuthHeaders(req));
        res.json(response.data);
    } catch (err) {
        res.status(401).json(err.response?.data || { message: 'Failed to create User' });
    }
}
