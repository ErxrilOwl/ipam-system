exports.getAuthHeaders = (req) => {
    return {
        'x-user-id': req.headers['x-user-id'],
        'x-user-role': req.headers['x-user-role']
    }
}