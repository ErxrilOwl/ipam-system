exports.getAuthHeaders = (req) => {
    return {
        'Authorization': req.headers.authorization
    }
}