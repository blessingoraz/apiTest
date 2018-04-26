const jwt = require('jsonwebtoken');

function VerifyToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['X-access-token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
};

module.exports = VerifyToken;
