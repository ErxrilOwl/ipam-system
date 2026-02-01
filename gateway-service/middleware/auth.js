const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization Header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.user = {
            id: decoded.sub,
            role: decoded.role,
            name: decoded.name,
            session_id: decoded.session_id,
            exp: decoded.exp
        }

        req.headers['x-user-id'] = decoded.sub;
        req.headers['x-user-name'] = decoded.name;
        req.headers['x-user-role'] = decoded.role;
        req.headers['x-session-id'] = decoded.session_id;

        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authenticate;