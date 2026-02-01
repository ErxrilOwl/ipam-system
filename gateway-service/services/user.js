require('dotenv').config();
const axios = require('axios');

const client = axios.create({
    baseURL: process.env.AUTH_SERVICE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

exports.getUsers = (params, headers) => client.get('/users', { params, headers });
exports.getUser = (id, headers) => client.get(`/users/${id}`, { headers });
exports.createUser = (data, headers) => client.post('/users', data, { headers });
exports.updateUser = (id, data, headers) => client.put(`/users/${id}`, data, { headers });
exports.deleteUser = (id, headers) => client.delete(`/users/${id}`, { headers });
