const axios = require('axios');

const client = axios.create({
    baseURL: process.env.AUTH_SERVICE_URL
});

exports.login = data => client.post('/auth/login', data);
exports.me = () => client.get('/auth/me');
exports.refresh = data => client.post('/auth/refresh', data);
exports.logout = data => client.post('/auth/logout', data);

exports.createUser = data => client.post('/users', data);