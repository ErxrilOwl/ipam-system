exports.getAuthHeaders = (req) => {
    return {
        'x-user-id': req.headers['x-user-id'],
        'x-user-name': req.headers['x-user-name'],
        'x-user-role': req.headers['x-user-role'],
        'x-session-id': req.headers['x-session-id']
    }
}