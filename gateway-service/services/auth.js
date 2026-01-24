require('dotenv').config();
const axios = require('axios');

const client = axios.create({
    baseURL: process.env.AUTH_SERVICE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

exports.login = data => client.post('/auth/login', data);
exports.me = headers => client.get('/auth/me', { headers });
exports.refresh = (data, headers) => client.post('/auth/refresh', data, { headers });
exports.logout = headers => client.post('/auth/logout', null, { headers });

exports.createUser = (data, headers) => client.post('/users', data, { headers });