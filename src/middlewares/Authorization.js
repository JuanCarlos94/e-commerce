const jwt = require('jsonwebtoken');
const Messages = require('../config/Messages');
const User = require('../models/User');

module.exports = function HasPermission(permissions) {
    return async function (req, res, next) {
        try {
            if (typeof permissions === 'string'){
                permissions = [permissions];
            }
            const token = req.headers['authorization'];
            return await jwt.verify(removeBearerName(token), process.env.SECRET, async (err, decoded) => {
                if (err)
                    return res.status(401).json({message: Messages.Authorization.TOKEN_INVALID});
                const userPermission = await loadUserPermission(decoded.id);
                if (permissions.includes(userPermission)){
                    return next();
                }
                return res.status(401).json({message: Messages.Authorization.PERMISSION_DENIED});
            })
        } catch (err) {
            return res.status(401).json({ message: err });
        }
    }
}

function removeBearerName(token) {
    if (!token) {
        throw Messages.Authorization.ACCESS_DENIED;
    }
    return token.slice(7);
}

async function loadUserPermission(userId) {
    const user = await User.findById(userId, {_id: false, permission: true}, (err) => {
        if(err) console.error(err);
    });
    return user.permission;
}