const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_strong_random_secret_key_12345';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded; // Attach user data to req.user
        next();
    });
};

module.exports = authMiddleware;
