require('dotenv').config();
const axios = require('axios');

const client = axios.create({
    baseURL: process.env.IP_SERVICE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

exports.getIPAddresses = (params, headers) => {
    console.log(headers);
    return client.get('/ip-addresses', { params, headers })
};
exports.createIPAddress = (data, headers) => client.post('/ip-addresses', data, { headers });
exports.updateIPAddress = (id, data, headers) => client.put(`/ip-addresses/${id}`, data, { headers });
exports.deleteIPAddress = (id, headers) => client.delete(`/ip-addresses/${id}`, { headers });
