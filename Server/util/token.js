import jwt from 'jwt-simple';
import Locals from '../providers/local.js';

const token = {
    generateToken (user) {
        // const timeStamp = Date.now();
        const payload = {
            sub: user._id
        }
        return jwt.encode(payload, Locals.config().jwtSecret);
    },
    verifyToken (inputToken, cb) {
        const decode = jwt.decode(inputToken, Locals.config().jwtSecret)
        if (!decode) return cb('Token is not verified.');
        cb(null, decode);
    }
}

export {token}