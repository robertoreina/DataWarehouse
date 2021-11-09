const config = require('../config');

const jwt = require('jsonwebtoken');

function ensureAuth(req, res, next) {
    try {
        const headerAuth = req.headers['authorization'];
        if (!headerAuth) {
            throw { status: 401, message: 'Token is missing!' };
        }

        const [, token] = headerAuth.split(' ');


        const tokenDecoded = jwt.verify(token, config.jwt_secret);
        req.user = tokenDecoded.user;

        return next();

    } catch (error) {
        let message;
        let status;
        switch (error.name) {
            case 'JsonWebTokenError':
                message = 'Error in the JWT';
                status = 401;
                break;
            default:
                message = error.message;
                status = 500;
                break;
        }
        return res.status(status).json({
            status,
            error: message
        });
    };
};

module.exports = ensureAuth;


